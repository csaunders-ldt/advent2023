import { flatten, forEach, map, range, split } from 'lodash';
import { solve } from '../utils/typescript';

type Direction = 'U' | 'D' | 'L' | 'R';
type Position = [number, number];

function parser(input: string) {
  return flatten(
    map(split(input, /\r?\n/), (l) => {
      const [dir, count] = split(l, ' ');
      return map(range(+count), () => dir);
    }),
  );
}

const moves: Record<Direction, Position> = {
  U: [0, 1],
  L: [-1, 0],
  R: [1, 0],
  D: [0, -1],
};

function sumPositions(a: Position, b: Position): Position {
  return [a[0] + b[0], a[1] + b[1]];
}

function btoi(b: boolean) {
  return b ? 1 : 0;
}

function getTail(head: Position, tail: Position): Position {
  if (Math.abs(head[0] - tail[0]) < 2 && Math.abs(head[1] - tail[1]) < 2) {
    return tail;
  }
  const x = tail[0] + btoi(head[0] > tail[0]) - btoi(head[0] < tail[0]);
  const y = tail[1] + btoi(head[1] > tail[1]) - btoi(head[1] < tail[1]);
  return [x, y];
}

function part1(input: Direction[]) {
  let head: Position = [0, 0];
  let tail: Position = [0, 0];
  const seen = new Set<string>();
  forEach(input, (dir) => {
    head = sumPositions(head, moves[dir]);
    tail = getTail(head, tail);
    seen.add(tail.toString());
  });
  return seen.size;
}

function part2(input: Direction[]) {
  let bits = map(range(10), () => [0, 0] as Position);
  const seen = new Set<string>();
  forEach(input, (dir) => {
    bits[0] = sumPositions(bits[0], moves[dir]);
    forEach(range(9), (i) => (bits[i + 1] = getTail(bits[i], bits[i + 1])));
    seen.add(bits[9].toString());
  });
  return seen.size;
}

solve({ part1, test1: 13, part2, test2: 36, parser });
