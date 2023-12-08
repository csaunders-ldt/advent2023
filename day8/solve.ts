import { fromPairs, keys } from 'lodash';
import { solve } from '../utils/typescript';

type Input = { path: string[]; nodes: Record<string, [string, string]> };

function parser(input: string) {
  const [rl, lines] = input.split('\n\n');
  const entries = lines.split('\n').map((l) => {
    const [src, ...dest] = l.match(/[0-9A-Z]+/g);
    return [src, dest];
  });
  return { path: rl.split(''), nodes: fromPairs(entries) };
}

function stepsFrom(i: Input, start: string, done: (p: string) => boolean) {
  const { path, nodes } = i;
  let [pos, steps] = [start, 0];
  while (!done(pos)) {
    pos = nodes[pos][path[steps++ % path.length] == 'L' ? 0 : 1];
  }
  return steps;
}

function part1(input: Input) {
  return stepsFrom(input, 'AAA', (pos) => pos === 'ZZZ');
}

function gcd(a: number, b: number) {
  return b == 0 ? a : gcd(b, a % b);
}

function lcm(vals: number[]) {
  return vals.reduce((res, next) => (res * next) / gcd(next, res));
}

function part2(input: Input) {
  const startNodes = keys(input.nodes).filter((n) => n.endsWith('A'));
  const values = startNodes.map((n) =>
    stepsFrom(input, n, (pos) => pos.endsWith('Z')),
  );
  return lcm(values);
}

solve({ part1, test1: 6, part2, test2: 6, parser });
