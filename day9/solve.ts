import { reverse, sum } from 'lodash';
import { solve } from '../utils/typescript';

type Input = number[][];

function parser(input: string): Input {
  return input.split('\n').map((l) => l.split(/\s+/).map(Number));
}

function extrapolate(lines: number[][]) {
  if (sum(lines.at(-1)) === 0) return sum(lines.map((l) => l.at(-1)));
  const nextLine = lines.at(-1).slice(1);
  return extrapolate([...lines, nextLine.map((v, i) => v - lines.at(-1)[i])]);
}

function part1(input: Input) {
  return sum(input.map((l) => extrapolate([l])));
}

function part2(input: Input) {
  return part1(input.map(reverse));
}

solve({ part1, test1: 114, part2, test2: 2, parser });
