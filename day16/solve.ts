import { map, max, maxBy, range, uniqBy } from 'lodash';
import { solve } from '../utils/typescript';

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

function bfs(grid: Grid, states: State[]): number {
  const seen = new Set<string>(states.map((s) => JSON.stringify(s)));
  while (states.length) {
    states = states.flatMap((state) => next(grid, state));
    states = states.filter(
      (state) => grid[state.y]?.[state.x] && !seen.has(JSON.stringify(state)),
    );
    states.forEach((state) => seen.add(JSON.stringify(state)));
  }
  const points = [...seen].map((v) => JSON.parse(v)).map(({ x, y }) => [x, y]);
  return uniqBy(points, JSON.stringify).length;
}

function part1(grid: Grid) {
  return bfs(grid, [{ x: 0, y: 0, dir: 1 }]);
}

function part2(grid: Grid) {
  const starts = range(grid.length).flatMap((i) => [
    { x: i, y: grid.length - 1, dir: 0 },
    { x: 0, y: i, dir: 1 },
    { x: i, y: 0, dir: 2 },
    { x: grid[0].length - 1, y: i, dir: 3 },
  ]);
  return max(map(starts, (start) => bfs(grid, [start])));
}

solve({ part1, test1: 46, part2, test2: 51, parser });
