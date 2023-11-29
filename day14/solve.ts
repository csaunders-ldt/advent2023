import { find, forEach, map, range, slice, split } from 'lodash';
import { solve } from '../utils/typescript';

type Coordinate = [number, number];
type Path = { from: Coordinate; to: Coordinate };

function parser(input: string): Path[] {
  return map(split(input, '\n'), (line) => {
    const parts = map(split(line, ' -> '), (p) => map(split(p, ','), Number));
    return map(slice(parts, 1), (to, i) => ({ from: parts[i], to }));
  }).flat(1) as Path[];
}

function* interpolate(from: Coordinate, to: Coordinate): Generator<Coordinate> {
  let [x, y] = from;
  const stepX = (to[0] - x) / (Math.abs(to[0] - x) || 1);
  const stepY = (to[1] - y) / (Math.abs(to[1] - y) || 1);
  while (x !== to[0] || y !== to[1]) {
    yield [(x += stepX), (y += stepY)];
  }
}

function drawRocks(grid: string[][], paths: Path[]) {
  forEach(paths, ({ from, to }) =>
    forEach([from, ...interpolate(from, to)], ([x, y]) => (grid[y][x] = '#')),
  );
}

function dropSand(
  grid: string[][],
  position: Coordinate,
): Coordinate | undefined {
  if (position[1] > 200) return undefined;

  const [x, y] = position;
  const candidateX = [x, x - 1, x + 1];
  const nextX = candidateX.find((x) => grid[y + 1][x] === '.');
  if (nextX) return dropSand(grid, [nextX, y + 1]);

  grid[y][x] = 'o';
  if (y === 0 && x === 500) return undefined;
  return position;
}

function part1(paths: Path[]) {
  const grid: string[][] = map(Array(1000), () => Array(1000).fill('.'));
  drawRocks(grid, paths);
  return find(range(10000), () => !dropSand(grid, [500, 0]));
}

function part2(paths: Path[]) {
  const grid: string[][] = map(Array(1000), () => Array(1000).fill('.'));
  const maxY = Math.max(...map(paths, ({ from }) => from[1]));
  drawRocks(grid, [...paths, { from: [0, maxY + 2], to: [1000, maxY + 2] }]);
  return find(range(100000), () => !dropSand(grid, [500, 0])) + 1;
}

solve({ part1, test1: 24, part2, test2: 93, parser });
