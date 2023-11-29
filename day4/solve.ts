import { chunk, countBy, map } from 'lodash';
import { solve } from '../utils/typescript';

type Ranges = [x1: number, y1: number, x2: number, y2: number];

function parseInput(input: string) {
  return chunk(map(input.match(/\d+/g), Number), 4) as Ranges[];
}

function contains([x1, y1, x2, y2]: Ranges) {
  return (y2 >= y1 && x1 >= x2) || (x2 >= x1 && y1 >= y2);
}

function part1(lines: Ranges[]) {
  return countBy(lines, contains).true;
}

function overlaps([x1, y1, x2, y2]: Ranges) {
  return x1 <= y2 && x2 <= y1;
}

function part2(lines: Ranges[]) {
  return countBy(lines, overlaps).true;
}

solve({ part1, test1: 2, part2, test2: 4, parser: parseInput });
