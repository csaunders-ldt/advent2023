import { fromPairs, range, sum, values } from 'lodash';
import { solve } from '../utils/typescript';
import { time } from 'console';

type Component = {
  key: string;
  type: '' | '%' | '&';
  memory: Record<string, boolean>;
  outputs: string[];
};
type Input = Record<string, Component>;

function parser(input: string): Input {
  const pairs = input.split('\n').map((l) => {
    const [_, type, key, value] = l.match(/([%&]?)(\w+) -> (.*)/);
    const outputs = value.split(', ');
    return [key, { key, type, memory: {}, outputs }] as [string, Component];
  });
  pairs.forEach(([key, { type, memory }]) => {
    if (type === '&') {
      const inputs = pairs.filter(([_, { outputs }]) => outputs.includes(key));
      inputs.forEach(([key]) => (memory[key] = false));
    }
  });
  return fromPairs(pairs);
}

function handleSignal(
  { type, memory }: Component,
  signal: boolean,
  from: string,
): true | false | undefined {
  if (type === '%') {
    if (signal) return undefined;

    memory['%'] = !(memory['%'] ?? false);
    return memory['%'];
  }
  if (type === '&') {
    memory[from] = signal;
    return !values(memory).every((v) => v);
  }
  return signal;
}

function pressButton(input: Input) {
  const queue = [{ key: 'broadcaster', signal: false, from: 'button' }];
  let [high, low] = [0, 0];
  while (queue.length) {
    const { key, signal, from } = queue.shift();
    const component = input[key];
    // console.log(`${from} - ${signal ? '-high' : '-low'}-> ${key}`);
    if (component) {
      const output = handleSignal(component, signal, from);
      if (output !== undefined) {
        component.outputs.forEach((key) => {
          queue.push({ key, signal: output, from: component.key });
        });
      }
    }
    if (signal) {
      high += 1;
    } else {
      low += 1;
    }
  }
  return [high, low];
}

function part1(input: Input) {
  const [h, l] = range(1000).reduce(
    ([high, low]) => {
      const [h, l] = pressButton(input);
      return [high + h, low + l];
    },
    [0, 0],
  );
  return h * l;
}

function gcd(a: number, b: number) {
  return b == 0 ? a : gcd(b, a % b);
}

function lcm(vals: number[]) {
  return vals.reduce((res, next) => (res * next) / gcd(next, res));
}

function getCycle(input: Input, key: string) {
  let current = input[key];
  let number = '';
  while (current) {
    const conjunctor = current.outputs
      .map((key) => input[key].type)
      .some((t) => t === '&');
    number = (conjunctor ? '1' : '0') + number;
    current = input[current.outputs.find((key) => input[key].type === '%')];
  }
  console.log(number);
  return parseInt(number, 2);
}

function part2(input: Input) {
  const outputs = input['broadcaster'].outputs;
  return lcm(outputs.map((key) => getCycle(input, key)));
}

solve({ part1, test1: 32000000, part2, parser });
