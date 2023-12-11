import { sum, zip } from 'lodash';
import { solve } from '../utils/typescript';

type Input = string[][];

function parser(input: string): Input {
  return input.split('\n').map((l) => l.split(''));
}

function gaps(input: Input) {
  let gaps = 0;
  return input.map((row) => (row.includes('#') ? gaps : gaps++));
}

function manhattenDistance([[x1, y1], [x2, y2]]: number[][]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function pairs<T>(arr: T[]): T[][] {
  return arr.flatMap((v, i) => arr.slice(i + 1).map((w) => [v, w]));
}

function part1(input: Input) {
  const gapsY = gaps(input);
  const gapsX = gaps(zip(...input));
  const points = input.flatMap((row, y) =>
    row.flatMap((col, x) =>
      col === '#' ? [[x + gapsX[x], y + gapsY[y]]] : [],
    ),
  );
  return sum(pairs(points).map(manhattenDistance));
}

function part2(input: Input) {
  const gapsY = gaps(input);
  const gapsX = gaps(zip(...input));
  const points = input.flatMap((row, y) =>
    row.flatMap((col, x) =>
      col === '#' ? [[x + gapsX[x] * 1000000, y + gapsY[y] * 1000000]] : [],
    ),
  );
  return sum(pairs(points).map(manhattenDistance));
}

solve({ part1, test1: 374, part2, test2: 82000292, parser });
