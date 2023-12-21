import { map, range, uniqBy } from 'lodash';
import { solve } from '../utils/typescript';

type Input = string[][];
type Coordinate = [number, number];

function move([x, y]: Coordinate, dir: number, n = 1): Coordinate {
  return [x + ((2 - dir) % 2) * n, y + ((dir - 1) % 2) * n];
}

function parser(input: string): Input {
  return map(input.replace(/S/g, '.').split('\n'), (l) => l.split(''));
}

function next([x, y]: Coordinate, grid: Input): Coordinate[] {
  const isPresent = ([x, y]) => grid[y]?.[x] === '.';
  return map(range(4), (dir) => move([x, y], dir)).filter(isPresent);
}

function prune(set: Coordinate[], seen: Set<string>) {
  const result = set.filter((c) => !seen.has(c.join(',')));
  set.forEach((c) => seen.add(c.join(',')));
  return uniqBy(result, (c) => c.join(','));
}

export function bfs(set: Coordinate[], input: Input, maxSteps: number) {
  let steps = 0;
  const seenOdd = new Set<string>();
  const seenEven = new Set<string>();
  while (steps++ < maxSteps) {
    set = set.flatMap((c) => next(c, input));
    set = prune(set, steps % 2 === 0 ? seenEven : seenOdd);
  }
  return maxSteps % 2 === 0 ? seenEven.size : seenOdd.size;
}

function getStart(input: Input): Coordinate[] {
  return [[input.length / 2 - 0.5, input.length / 2 - 0.5]];
}

function part1(input: Input, isTest: boolean) {
  return bfs(getStart(input), input, isTest ? 6 : 64);
}

function part2(input: Input) {
  const blankGrid = input.map((row) => range(7).flatMap(() => row));
  const newGrid = range(7).flatMap(() => blankGrid);

  const start = input.length / 2 - 0.5;
  const constant = bfs(getStart(newGrid), newGrid, start);
  const firstCycle = bfs(getStart(newGrid), newGrid, input.length + start);
  const secondCycle = bfs(getStart(newGrid), newGrid, input.length * 2 + start);

  const quadratic = (secondCycle - 2 * firstCycle + constant) / 2;
  const linear = firstCycle - constant - quadratic;

  const x = (26501365 - start) / input.length;
  return quadratic * x ** 2 + linear * x + constant;
}

solve({ part1, test1: 16, part2, parser });
