import { zip } from 'lodash';
import { solve } from '../utils/typescript';

type Input = string[][];

function parser(input: string): Input {
  return input.split('\n').map((l) => l.split(''));
}

function sumDir([row, ...rest]: Input, expansion = 2, prev = 0, dist = 0) {
  if (!row) return 0;
  const numStars = row.filter((c) => c === '#').length;
  dist += prev * (numStars === 0 ? expansion : 1);
  return dist * numStars + sumDir(rest, expansion, prev + numStars, dist);
}

function part1(input: Input) {
  return sumDir(input) + sumDir(zip(...input));
}

function part2(input: Input) {
  return sumDir(input, 1000000) + sumDir(zip(...input), 1000000);
}

solve({ part1, test1: 374, part2, test2: 82000210, parser });
