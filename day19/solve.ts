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

function parseRule(rule: string): [string, Rule | string][] {
  const [k, value] = rule.match(/(\w+){(.*)}/).slice(1);

  return value.split(',').map((r, i) => {
    if (!r.match(/[<>]/)) return [`${k}${i}`, `${r}0`];

    const [_, key, op, value, pass] = r.match(/(\w+)([<>])(\d+):(\w+)/);
    const results = { pass: `${pass}0`, fail: `${k}${i + 1}` };
    const rule = { key, op, value: +value, ...results };
    return [`${k}${i}`, rule] as [string, Rule];
  });
}

function parser(input: string): Input {
  const [rulesStr, inputsStr] = input.split('\n\n');
  const pairs = rulesStr.split('\n').flatMap(parseRule);
  const inputs = inputsStr.split('\n').map((line) => {
    const [_, x, m, a, s] = line.match(/(\d+)/g);
    return { x: [+x, +x], m: [+m, +m], a: [+a, +a], s: [+s, +s] } as Range;
  });

  return { rules: Object.fromEntries(pairs), inputs };
}

function getSize(range: Range) {
  return values(range).reduce((acc, [min, max]) => acc * (max - min + 1), 1);
}

function passRange([l, r]: Coordinate, { value, op }: Omit<Rule, 'key'>) {
  return op === '>' ? [max([value + 1, l]), r] : [l, min([value - 1, r])];
}

function failRange([l, r]: Coordinate, { value, op }: Omit<Rule, 'key'>) {
  return op === '>' ? [l, min([value, r])] : [max([value, l]), r];
}

function splitRange(range: Range, { key, ...rule }: Rule) {
  const ranges = [passRange(range[key], rule), failRange(range[key], rule)];
  return ranges.map((r) => ({ ...range, [key]: r }));
}

function evalRule(range: Range, ruleName: string, rules: Rules): number {
  if (ruleName === 'R0' || getSize(range) < 0) return 0;
  if (ruleName === 'A0') return getSize(range);

  const rule = (rules[rules[ruleName] as string] ?? rules[ruleName]) as Rule;
  const [pass, fail] = splitRange(range, rule);
  return evalRule(pass, rule.pass, rules) + evalRule(fail, rule.fail, rules);
}

function evalRules(range: Range, rules: Rules) {
  return evalRule(range, 'in0', rules) && sum(values(range).map((v) => v[0]));
}

function part1({ rules, inputs }: Input) {
  return sum(inputs.map((range) => evalRules(range, rules)));
}

function part2(input: Input) {
  const start = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };
  return evalRule(start as Range, 'in0', input.rules);
}

solve({ part1, test1: 19114, part2, test2: 167409079868000, parser });
