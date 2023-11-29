import { every, filter, flatMap, forEach, join, map, split, sum } from 'lodash';
import { solve } from '../utils/typescript';

type Point = [x: number, y: number, z: number]; //idk its just easier

function digits(line: string) {
  return join([...line.match(/(-?\d+)/g)], ',');
}

function parser(input: string): Set<string> {
  return new Set<string>(map(split(input, '\n'), digits));
}

function neighbours(point: string): Point[] {
  const val = eval(`[${point}]`);
  return flatMap<number, Point>(val, (dim, i) => [
    [...val.slice(0, i), dim - 1, ...val.slice(i + 1)] as Point,
    [...val.slice(0, i), dim + 1, ...val.slice(i + 1)] as Point,
  ]);
}

function part1(points: Set<string>) {
  const hasSeen = (n: Point) => points.has(n.toString());
  const sides = (p: string) => 6 - filter(neighbours(p), hasSeen).length;
  return sum(map([...points], sides));
}

function validNeighbours(point: string) {
  return filter(neighbours(point), (p) => every(p, (v) => v >= -1 && v <= 26));
}

function floodFill(todo: Set<string>, seen: Set<string>, blocks: Set<string>) {
  if (todo.size === 0) return seen;

  const allNeighbours = map(flatMap([...todo], validNeighbours), String);
  const next = filter(allNeighbours, (v) => !seen.has(v) && !blocks.has(v));
  forEach(allNeighbours, (v) => seen.add(v));
  return floodFill(new Set(next), seen, blocks);
}

function part2(points: Set<string>) {
  const seenSet = floodFill(new Set(['-1,-1,-1']), new Set(), points);
  const isPoint = (n) => seenSet.has(n.toString()) && !points.has(n.toString());
  const sides = (p: string) => filter(neighbours(p), isPoint).length;
  return sum(map([...points], sides));
}

solve({ part1, test1: 64, part2, test2: 58, parser });
