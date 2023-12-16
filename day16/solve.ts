import { maxBy, uniqBy } from 'lodash';
import { solve } from '../utils/typescript';

type Grid = string[][];
type State = { x: number; y: number; dir: number }; // 0: up, 1: right, 2: down, 3: left

function parser(input: string): Grid {
  return input.split('\n').map((l) => l.split(''));
}

const dxdy = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
function move({ x, y }: Omit<State, 'dir'>, dir: number) {
  return { x: x + dxdy[dir][0], y: y + dxdy[dir][1], dir };
}

function next(grid: Grid, { x, y, dir }: State): State[] {
  const char = grid[y]?.[x];

  if (char === '/') {
    return [move({ x, y }, dir + (dir % 2 === 0 ? 1 : -1))];
  }
  if (char === '\\') {
    return [move({ x, y }, 3 - dir)];
  }
  if (char === '|' && dir % 2 === 1) {
    return [move({ x, y }, 0), move({ x, y }, 2)];
  }
  if (char === '-' && dir % 2 === 0) {
    return [move({ x, y }, 1), move({ x, y }, 3)];
  }
  return [move({ x, y }, dir)];
}

function bfs(grid: Grid, states: State[]): [number, number][] {
  const seen = new Set<string>(states.map((s) => JSON.stringify(s)));
  while (states.length) {
    states = states.flatMap((state) => next(grid, state));
    states = states.filter(
      (state) => grid[state.y]?.[state.x] && !seen.has(JSON.stringify(state)),
    );
    states.forEach((state) => seen.add(JSON.stringify(state)));
  }
  return [...seen].map((v) => JSON.parse(v)).map(({ x, y }) => [x, y]);
}

function part1(grid: Grid) {
  const points = bfs(grid, [{ x: 0, y: 0, dir: 1 }]);
  return uniqBy(points, JSON.stringify).length;
}

function part2(grid: Grid) {
  const topStarts = grid.map((_, x) => ({ x, y: 0, dir: 2 }));
  const bottomStarts = grid.map((_, x) => ({ x, y: grid.length - 1, dir: 0 }));
  const leftStarts = grid[0].map((_, y) => ({ x: 0, y, dir: 1 }));
  const rightStarts = grid[0].map((_, y) => ({
    x: grid[0].length - 1,
    y,
    dir: 3,
  }));
  const starts = [...topStarts, ...bottomStarts, ...leftStarts, ...rightStarts];
  const scores = starts.map((start) => {
    const points = bfs(grid, [start]);
    return [uniqBy(points, JSON.stringify).length, start];
  });
  console.log(scores);
  const best = maxBy(starts, (start) => {
    const points = bfs(grid, [start]);
    return uniqBy(points, JSON.stringify).length;
  });
  console.log(best);
  const points = bfs(grid, [best]);
  return uniqBy(points, JSON.stringify).length;
}

solve({ part1, test1: 46, part2, test2: 51, parser });
