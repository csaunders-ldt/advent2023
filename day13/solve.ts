import { sum, zip } from 'lodash';
import { solve } from '../utils/typescript';

type Grid = string[][];

function parseLine(input: string): Grid {
  return input.split('\n').map((l) => l.split(''));
}

function parser(input: string): Grid[] {
  return input.split('\n\n').map(parseLine);
}

function scoreGrid(grid: Grid, numErrors = 0) {
  const line = grid.slice(1).findIndex((_, i) => {
    let [l, r, mistakes] = [i, i + 1, 0];
    while (grid[l] && grid[r]) {
      mistakes += grid[l].filter((c, j) => c !== grid[r][j]).length;
      l--;
      r++;
    }
    return mistakes === numErrors;
  });
  if (line === -1) return scoreGrid(zip(...grid), numErrors) / 100;

  return (line + 1) * 100;
}

function part1(input: Grid[]) {
  return sum(input.map((l) => scoreGrid(l, 0)));
}

function part2(input: Grid[]) {
  return sum(input.map((l) => scoreGrid(l, 1)));
}

solve({ part1, test1: 405, part2, test2: 400, parser });
