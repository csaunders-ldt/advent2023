import { range, sum } from 'lodash';
import { solve } from '../utils/typescript';

type Input = string[][];
// 1 if connected, 0 if not, Top Right Bottom Left
const paths = {
  '|': 0b1010,
  '-': 0b0101,
  L: 0b1100,
  J: 0b1001,
  '7': 0b0011,
  F: 0b0110,
  '.': 0b0000,
  S: 0b1111,
};

function parser(input: string): Input {
  return input.split('\n').map((l) => l.split(''));
}

function neighbours([row, col]: [number, number]): [number, number][] {
  return [
    [row, col - 1],
    [row + 1, col],
    [row, col + 1],
    [row - 1, col],
  ] as [number, number][];
}

function validNeighbours(grid: Input, [row, col]: [number, number]) {
  const mask = paths[grid[row][col]];
  return neighbours([row, col]).filter((_, i) => !!((mask >> i) & 1));
}

function path(grid: Input, start: [number, number][]): Set<string> {
  let [seen, toSearch] = [new Set<string>(), start];
  while (toSearch.length) {
    const next = toSearch.flatMap((n) => validNeighbours(grid, n));
    toSearch = next.filter((v) => !seen.has(String(v)));
    toSearch.forEach((v) => seen.add(String(v)));
  }
  return seen;
}

function getStart(input: Input) {
  const row = input.findIndex((row) => row.some((l) => l.includes('S')));
  const col = input[row].findIndex((col) => col === 'S');
  return neighbours([row, col]).filter(([row, col]) =>
    validNeighbours(input, [row, col]).some(([r, c]) => input[r][c] === 'S'),
  );
}

function part1(input: Input) {
  return path(input, getStart(input)).size / 2 - 1;
}

function scoreLine(chars: [string, boolean][], inside = false) {
  if (!chars.length) return 0;

  const [[value, seen], ...rest] = chars;
  if (seen) {
    return scoreLine(rest, inside !== !!(paths[value] & 0b1000));
  }
  return (inside ? 1 : 0) + scoreLine(rest, inside);
}

function part2(input: Input) {
  const insidePath = path(input, getStart(input));
  const scores = input.map((line, y) => {
    return scoreLine(line.map((v, x) => [v, insidePath.has(String([y, x]))]));
  });
  return sum(scores);
}

solve({ part1, test1: 8, part2, test2: 10, parser });
