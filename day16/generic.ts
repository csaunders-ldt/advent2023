import { map, max, partial, partialRight, range, uniqBy } from 'lodash';
import { solve } from '../utils/typescript';
import { bfs, dfs, pruneSeen } from '../utils/typescript/search';

type Grid = string[][];
type State = { x: number; y: number; dir: number }; // 0: up, 1: right, 2: down, 3: left

function parser(input: string): Grid {
  return input.split('\n').map((l) => l.split(''));
}

function move({ x, y }: Omit<State, 'dir'>, dir: number) {
  return { x: x + ((2 - dir) % 2), y: y + ((dir - 1) % 2), dir };
}

function nextDirs(char: string, dir: number) {
  if (char === '/') return [dir + (dir % 2 === 0 ? 1 : -1)];
  if (char === '\\') return [3 - dir];
  if (char === '|' && dir % 2 === 1) return [0, 2];
  if (char === '-' && dir % 2 === 0) return [1, 3];
  return [dir];
}

function next(grid: Grid, { x, y, dir }: State): State[] {
  return nextDirs(grid[y]?.[x], dir).map((dir) => move({ x, y }, dir));
}

function part1(grid: Grid) {
  const seen = new Set<string>();
  const prune = partialRight(pruneSeen, seen);
  bfs([{ x: 0, y: 0, dir: 1 }], partial(next, grid), prune);
  const points = [...seen].map((v) => JSON.parse(v)).map(({ x, y }) => [x, y]);
  return uniqBy(points, JSON.stringify).length;
}

export function part1Dfs(grid: Grid) {
  const seen = new Set<string>();
  const nextFn = (state: State) => {
    const nextResults = next(grid, state);
    const unseen = nextResults.filter((s) => !seen.has(JSON.stringify(s)));
    unseen.forEach((s) => seen.add(JSON.stringify(s)));
    return unseen;
  };
  dfs([{ x: 0, y: 0, dir: 1 }], nextFn);
  const points = [...seen].map((v) => JSON.parse(v)).map(({ x, y }) => [x, y]);
  return uniqBy(points, JSON.stringify).length;
}

function part2(_: Grid) {
  throw new Error('This is example code.');
}

solve({ part1, test1: 46, part2, parser });
