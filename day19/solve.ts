import { max, min, sum, values } from 'lodash';
import { solve } from '../utils/typescript';

type Coordinate = [number, number];
type Range = { x: Coordinate; m: Coordinate; a: Coordinate; s: Coordinate };

type Rule = {
  key: 'x' | 'm' | 'a' | 's';
  op: '>' | '<';
  value: number;
  pass: string;
  fail: string;
};

type Rules = Record<string, Rule | string>;
type Input = { rules: Rules; inputs: Range[] };

function parser(input: string): Input {
  const [rulesStr, inputsStr] = input.split('\n\n');

  const pairs = rulesStr.split('\n').flatMap((rule) => {
    const [k, value] = rule.match(/(\w+){(.*)}/).slice(1);
    return value.split(',').map((r, i) => {
      if (!r.match(/[<>]/)) return [`${k}${i}`, `${r}0`];
      const [_, key, op, value, pass] = r.match(/(\w+)([<>])(\d+):(\w+)/);
      const rule = {
        key,
        op,
        value: +value,
        pass: `${pass}0`,
        fail: `${k}${i + 1}`,
      };
      return [`${k}${i}`, rule] as [string, Rule];
    });
  });

  const rules = Object.fromEntries(pairs);
  const inputs = inputsStr.split('\n').map((line) => {
    const [_, x, m, a, s] = line.match(/x=(\d+),m=(\d+),a=(\d+),s=(\d+)/);
    return { x: [+x, +x], m: [+m, +m], a: [+a, +a], s: [+s, +s] } as Range;
  });

  return { rules, inputs };
}

function getSize(range: Range) {
  return values(range).reduce((acc, [min, max]) => acc * (max - min + 1), 1);
}

function splitRange(range: Range, { key, op, value }: Rule) {
  const [l, r] = range[key];
  const [pass, fail] =
    op === '>'
      ? [
          { ...range, [key]: [max([value + 1, l]), r] },
          { ...range, [key]: [l, min([value, r])] },
        ]
      : [
          { ...range, [key]: [l, min([value - 1, r])] },
          { ...range, [key]: [max([value, l]), r] },
        ];
  return [pass, fail];
}

function evalRule(range: Range, ruleName: string, rules: Rules): number {
  if (ruleName === 'R0' || getSize(range) < 0) return 0;
  if (ruleName === 'A0') return getSize(range);
  const rule = rules[ruleName];
  if (typeof rule === 'string') return evalRule(range, rule, rules);

  const [pass, fail] = splitRange(range, rule);
  return evalRule(pass, rule.pass, rules) + evalRule(fail, rule.fail, rules);
}

function part1({ rules, inputs }: Input) {
  return sum(
    inputs.map((input) => {
      const result = evalRule(input, 'in0', rules);
      return result && sum(values(input).map((v) => v[0]));
    }),
  );
}

function part2(input: Input) {
  const start = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };
  return evalRule(start as Range, 'in0', input.rules);
}

solve({ part1, test1: 19114, part2, test2: 167409079868000, parser });
