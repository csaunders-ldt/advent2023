import { every, filter, find, forEach, map, max, range, times } from 'lodash';
import { solve } from '../utils/typescript';

type BGrid = number[];
const shapes: BGrid[] = [
  [0b1111],
  [0b010, 0b111, 0b010],
  [0b100, 0b100, 0b111],
  [1, 1, 1, 1],
  [0b11, 0b11],
];
type Position = [x: number, y: number];

type Wind = Generator<1 | -1>;
function* yieldGusts(instructions: number[]): Wind {
  for (let i = 0; ; i++) yield instructions[i % instructions.length] as 1 | -1;
}

function parser(input: string): Wind {
  return yieldGusts(map(input.split(''), (c) => c.charCodeAt(0) - 61));
}

function canFit(grid: BGrid, shape: BGrid, [x, y]: Position) {
  if (y - shape.length < -1 || x < 0) return false;
  const clear = (row: number, dy: number) => (grid[y - dy] & (row << x)) === 0;
  return every(shape, (row, dy) => clear(row, dy) && row << x < 128);
}

function getTop(grid: BGrid, shape: BGrid): number {
  const emptyRows = find(range(8), (y) => grid[grid.length - y - 1] !== 0);
  times(3 + shape.length - emptyRows, () => grid.push(0));
  return grid.length - 1 - max([emptyRows - 3 - shape.length, 0]);
}

function drop(grid: BGrid, shape: BGrid, wind: Wind, [x, y]: Position) {
  const dx = wind.next().value;
  const newX = canFit(grid, shape, [x + dx, y]) ? x + dx : x;
  if (!canFit(grid, shape, [newX, y - 1])) return [newX, y];
  return drop(grid, shape, wind, [newX, y - 1]);
}

function placeShape(grid: BGrid, shape: BGrid, wind: Wind) {
  const [x, y] = drop(grid, shape, wind, [2, getTop(grid, shape)]);
  forEach(shape, (row, dy) => (grid[y - dy] |= row << x));
}

function part1(wind: Wind) {
  const grid = Array(4).fill(0);
  times(2022, (i) => placeShape(grid, shapes[i % shapes.length], wind));
  return filter(grid, (v) => v).length;
}

function part2(gusts: Wind) {
  const target = 1000000000000;
  const start = 5000;

  const grid = Array(4).fill(0);
  const heights = map(range(20000), (i) => {
    placeShape(grid, shapes[i % shapes.length], gusts);
    return filter(grid, (v) => v).length;
  });
  const diff = (i: number, j = 0) => heights[start + i] - heights[start + j];
  const cycle = find(range(100, 2000), (i) =>
    every(range(1, 3), (j) => diff(i * (j + 1), i * j) === diff(i)),
  );

  const numCycles = Math.floor((target - start) / cycle);
  const cycleValue = heights[start + cycle] - heights[start];
  const remainder = (target - start) % cycle;
  return heights[start + remainder] + numCycles * cycleValue - 1;
}

solve({ part1, test1: 3068, part2, test2: 1514285714288, parser });
