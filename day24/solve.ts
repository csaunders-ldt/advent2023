import {
  countBy,
  filter,
  find,
  flatMap,
  forEach,
  map,
  partial,
  split,
  times,
  uniqBy,
  values,
} from 'lodash';
import { solve } from '../utils/typescript';

type Point = [x: number, y: number];
type Blizzard = { char: '<' | '>' | '^' | 'v'; position: Point };
type Grid = { max: Point; blizzards: Blizzard[] };
type State = [x: number, y: number, time: number];

function hash(blizzards: Blizzard[]) {
  return new Set(map(blizzards, 'position').map(String));
}

function parser(input: string): Grid {
  const blizzards = [];
  forEach(split(input, '\n').slice(1, -1), (line, y) => {
    forEach(split(line, '').slice(1, -1), (char, x) => {
      if (char !== '.') blizzards.push({ char, position: [x, y] });
    });
  });
  const height = countBy(input, (char) => char === '\n').true - 1;
  return { max: [input.indexOf('\n') - 2, height], blizzards };
}

function wrapTo([width, height]: Point, [x, y]: Point): Point {
  return [((x % width) + width) % width, ((y % height) + height) % height];
}

const delta = { '<': [-1, 0], '>': [1, 0], '^': [0, -1], v: [0, 1] };
function next(blizzards: Blizzard[], max: Point): Blizzard[] {
  return map(blizzards, ({ position: [x, y], char }) => ({
    char,
    position: wrapTo(max, [x + delta[char][0], y + delta[char][1]]),
  }));
}

function pointsAround([x, y]: Point, height: number, width: number) {
  const opts = map(values(delta), ([dx, dy]) => [x + dx, y + dy]);
  return filter(
    opts.concat([[x, y]]),
    ([x, y]) =>
      (x >= 0 && y >= 0 && x < width && y < height) ||
      (x === width - 1 && y === height) ||
      (x === 0 && y === -1),
  );
}

function getSiblings(
  hashes: Set<String>[],
  [width, height]: Point,
  [x, y, time]: State,
): State[] {
  const nearby = pointsAround([x, y], height, width);
  const points = filter(nearby, (point) => !hashes[time].has(String(point)));
  return map(points, ([x, y]) => [x, y, time + 1]);
}

function timeTaken(grid: Grid, states: State[], end: Point) {
  let grids = [grid.blizzards];
  times(1000, () => (grids = [...grids, next(grids.last, grid.max)]));
  const siblings = partial(getSiblings, map(grids.slice(1), hash), grid.max);

  for (let time = 0; time < 1000; time++) {
    states = uniqBy(flatMap(states, siblings), String);
    if (find(states, ([x, y]) => x == end[0] && y === end[1])) return time + 1;
  }
  throw new Error('Not found');
}

function end({ max: [x, y] }: { max: Point }): Point {
  return [x - 1, y];
}

function part1(grid: Grid) {
  return timeTaken(grid, [[0, -1, 0]], end(grid));
}

function part2(grid: Grid) {
  const there = timeTaken(grid, [[0, -1, 0]], end(grid));
  const back = timeTaken(grid, [[...end(grid), there]], [0, -1]);
  const again = timeTaken(grid, [[0, -1, there + back]], end(grid));
  return there + back + again;
}

solve({ part1, test1: 18, part2, test2: 54, parser });
