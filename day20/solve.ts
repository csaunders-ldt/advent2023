import { fromPairs, range, sum, values, zip } from 'lodash';
import { solve } from '../utils/typescript';

type Component = {
  key: string;
  type: '' | '%' | '&';
  data: Record<string, boolean>;
  outputs: string[];
};
type Input = Record<string, Component>;

function parser(input: string): Input {
  const pairs = input.split('\n').map((l) => {
    const [_, type, key, v] = l.match(/([%&]?)(\w+) -> (.*)/);
    return [key, { key, type, data: {}, outputs: v.split(', ') }];
  }) as [string, Component][];
  pairs.forEach(([key, { type, data }]) => {
    if (type !== '&') return;

    const inputs = pairs.filter(([_, { outputs }]) => outputs.includes(key));
    inputs.forEach(([key]) => (data[key] = false));
  });
  return fromPairs(pairs);
}

function handleSignal(
  { type, data }: Component,
  signal: boolean,
  from: string,
): true | false | undefined {
  if (type === '%') {
    return signal ? undefined : (data['%'] = !data['%']);
  }
  if (type === '&') {
    data[from] = signal;
    return !values(data).every((v) => v);
  }
  return signal;
}

function pressButton(input: Input) {
  const queue = [{ key: 'broadcaster', signal: false, from: 'button' }];
  let result = [0, 0];
  while (queue.length) {
    const { key, signal, from } = queue.shift();
    const component = input[key];
    result[+signal] += 1;
    const output = component && handleSignal(component, signal, from);
    if (output === undefined) continue;

    component.outputs.forEach((key) => {
      queue.push({ key, signal: output, from: component.key });
    });
  }
  return result;
}

function part1(input: Input) {
  const results = zip(...range(1000).map(() => pressButton(input)));
  return results.map(sum).reduce((a, b) => a * b);
}

function gcd(a: number, b: number) {
  return b == 0 ? a : gcd(b, a % b);
}

function lcm(vals: number[]) {
  return vals.reduce((res, next) => (res * next) / gcd(next, res));
}

function getCycle(input: Input, current: Component) {
  let number = '';
  while (current) {
    const conjunctor = current.outputs.some((key) => input[key].type === '&');
    number = (conjunctor ? '1' : '0') + number;
    current = input[current.outputs.find((key) => input[key].type === '%')];
  }
  return parseInt(number, 2);
}

function part2(input: Input) {
  const outputs = input['broadcaster'].outputs;
  return lcm(outputs.map((key) => getCycle(input, input[key])));
}

solve({ part1, test1: 32000000, part2, parser });
