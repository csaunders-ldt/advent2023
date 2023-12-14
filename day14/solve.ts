import { entries, map, reverse, sum, sumBy, times, zip } from 'lodash';
import { solve } from '../utils/typescript';

type Input = string[][];

function parser(input: string): Input {
  return zip(...reverse(input.split('\n').map((l) => l.split(''))));
}

function roll([char, ...rest]: string[], buffer: string[] = []): string[] {
  if (!rest.length) return [...buffer.sort(), char];

  if (['.', 'O'].includes(char)) return roll(rest, [...buffer, char]);

  return [...buffer.sort(), char, ...roll(rest)];
}

function score(input: Input) {
  return sumBy(input, (row) => sum(row.map((c, x) => (c === 'O' ? x + 1 : 0))));
}

function part1(input: Input) {
  return score(map(input, (l) => roll(l)));
}

function hash(input: Input) {
  return map(input, (row) => row.join('')).join('\n');
}

function rotateAndRoll(input: Input) {
  return zip(...reverse(input.map((l) => roll(l))));
}

function part2(input: Input) {
  const seen: Record<string, number> = {};
  let cycles = 0;
  while (!seen[hash(input)]) {
    seen[hash(input)] = cycles++;
    times(4, () => (input = rotateAndRoll(input)));
  }
  const start = seen[hash(input)];
  const finalPos = ((1000000000 - start) % (cycles - start)) + start;
  const [grid] = entries(seen).find(([_, c]) => c === finalPos);
  return score(grid.split('\n').map((l) => l.split('')));
}

solve({ part1, test1: 136, part2, test2: 64, parser });
