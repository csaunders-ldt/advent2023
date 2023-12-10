import { range, sum } from 'lodash';
import { solve } from '../utils/typescript';

type Input = string[][];
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
  const filter = range(4).map((i) => ((mask >> i) & 1) == 1);
  return neighbours([row, col]).filter((_, i) => filter[i]);
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

function part2(input: Input) {
  const seen = path(input, getStart(input));
  const scores = input.map((line, y) => {
    let inside = false;
    let score = 0;
    let x = 0;
    for (const l of line) {
      if (paths[l] & 0b1000 && seen.has(`${y},${x}`)) {
        inside = !inside;
      }
      if (!seen.has(`${y},${x}`) && inside) {
        score += 1;
      }
      x++;
    }
    return score;
  });
  return sum(scores);
}

solve({ part1, test1: 8, part2, test2: 10, parser });
