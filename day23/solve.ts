import {
  countBy,
  every,
  filter,
  flatMap,
  join,
  map,
  max,
  min,
  split,
  times,
  zip,
} from 'lodash';
import { solve } from '../utils/typescript';

type Point = [x: number, y: number];

function parser(input: string): Point[] {
  const grid = map(split(input, '\n'), (l) => split(l, ''));
  const maybeElves = flatMap(grid, (row, y) =>
    map(row, (cell, x) => (cell === '#' ? [x, y] : undefined)),
  );
  return filter(maybeElves, (e) => e !== undefined) as Point[];
}

type Move = { center: Point; left: Point; right: Point };
const moves: Move[] = [
  { center: [0, -1], left: [1, -1], right: [-1, -1] },
  { center: [0, 1], left: [-1, 1], right: [1, 1] },
  { center: [-1, 0], left: [-1, 1], right: [-1, -1] },
  { center: [1, 0], left: [1, -1], right: [1, 1] },
];

function addPoints([x1, y1]: Point, [x2, y2]: Point): Point {
  return [x1 + x2, y1 + y2];
}

function nextMove(elf: Point, move: Move, elves: Set<string>) {
  const { center, left, right } = move;
  const canMove = every(
    [center, left, right],
    (point) => !elves.has(String(addPoints(elf, point))),
  );
  return canMove ? addPoints(elf, center) : undefined;
}

function nextPosition(elf: Point, elves: Set<string>, i = 0) {
  const candidates = [...moves.slice(i % 4), ...moves.slice(0, i % 4)];
  const options = map(candidates, (move) => nextMove(elf, move, elves));
  const next = filter(options, (o) => !!o);
  if (next.length === 4 || next.length === 0) return elf;

  return next[0];
}

function nextState(elves: Point[], i: number) {
  const elfHash = new Set(map(elves, String));
  const proposedNext = map(elves, (elf) => nextPosition(elf, elfHash, i));
  const counts = countBy(proposedNext, String);
  return map(proposedNext, (e, i) => (counts[String(e)] === 1 ? e : elves[i]));
}

function part1(elves: Point[]) {
  times(10, (i) => (elves = nextState(elves, i)));
  const [x, y] = zip(...elves);
  return (max(x) - min(x) + 1) * (max(y) - min(y) + 1) - elves.length;
}

function part2(elves: Point[]) {
  for (let i = 0; i < 1000000000; i++) {
    const hash = join(elves, ',');
    elves = nextState(elves, i);
    if (hash === join(elves, ',')) return i + 1;
  }
  return -1;
}

solve({ part1, test1: 110, part2, test2: 20, parser });
