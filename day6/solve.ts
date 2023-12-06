import { ceil, floor, reduce, zip } from 'lodash';
import { solve } from '../utils/typescript';

function parser(input: string) {
  return input.split('\n').map((l) => l.match(/\d+/g)?.map(Number));
}

function score(input: [time: number, distance: number]) {
  const [time, distance] = input;
  const triangleEdge = (time ** 2 - 4 * (distance + 1)) ** 0.5;
  const leftEdge = floor((time + triangleEdge) / 2);
  const rightEdge = ceil((time - triangleEdge) / 2);
  return leftEdge - rightEdge + 1;
}

function part1(input: [number, number][]) {
  return reduce(zip(...input).map(score), (a, b) => a * b);
}

function part2(input: [number, number][]) {
  const [time, dist] = input.map((l) => l.map(String).join('')).map(Number);
  return score([time, dist]);
}

solve({ part1, test1: 288, part2, test2: 71503, parser });
