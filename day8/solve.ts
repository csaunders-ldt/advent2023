import {
  countBy,
  find,
  flatten,
  forEach,
  map,
  max,
  range,
  reduce,
  reverse,
  zip,
} from 'lodash';
import { getGridParser, solve } from '../utils/typescript';

type Tree = { size: number; seen: boolean };

function passGrid(grid: Tree[][]) {
  forEach(grid, (row) => {
    reduce(
      row,
      (maxSeen, tree) => {
        tree.seen ||= maxSeen < tree.size;
        return max([maxSeen, tree.size]);
      },
      -1,
    );
  });
  return grid;
}

function horizontalFlyover(grid: Tree[][]) {
  return passGrid(map(passGrid(grid), reverse));
}

function part1(grid: Tree[][]) {
  const passedGrid = horizontalFlyover(zip(...horizontalFlyover(grid)));
  return countBy(passedGrid.flat(), 'seen').true;
}

function countVisible(trees: Tree[], size: number) {
  const dist = find(range(trees.length), (i) => trees[i].size >= size);
  return dist === undefined ? trees.length : dist + 1;
}

function hScore(grid: Tree[][], x: number, y: number, size: number) {
  const left = countVisible(reverse(grid[x].slice(0, y)), size);
  const right = countVisible(grid[x].slice(y + 1), size);
  return left * right;
}

function scenicScore(grid: Tree[][], x: number, y: number) {
  const { size } = grid[x][y];
  return hScore(grid, x, y, size) * hScore(zip(...grid), y, x, size);
}

function part2(grid: Tree[][]) {
  const treeScores = map(grid.slice(1, -1), (row, x) =>
    map(row.slice(1, -1), (_, y) => scenicScore(grid, x + 1, y + 1)),
  );
  return max(flatten(treeScores));
}

const parser = getGridParser({ mapFn: (x) => ({ size: +x, seen: false }) });
solve({ part1, test1: 21, part2, test2: 8, parser });
