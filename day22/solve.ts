import { max, range, sortBy, sum, uniq } from 'lodash';
import { solve } from '../utils/typescript';

type Coordinate = [x: number, y: number, z: number];
type Block = { start: Coordinate; end: Coordinate; supportedBy: Set<Block> };
type Input = Block[];

function parseLine(line: string): Coordinate {
  return line.split(',').map(Number) as Coordinate;
}

function parseBlock(line: string): Block {
  const [start, end] = line.split('~').map(parseLine);
  return { start, end, supportedBy: new Set<Block>() };
}

function parser(input: string): Input {
  return input.split('\n').map(parseBlock);
}

function cells({ start: [x1, y1], end: [x2, y2] }: Block) {
  return range(x1, x2 + 1).flatMap((x) => range(y1, y2 + 1).map((y) => [x, y]));
}

type MaxZMap = { z: number; block?: Block }[][];
function drop(toDrop: Block, map: MaxZMap) {
  const allCells = cells(toDrop);
  const [minZ, maxZ] = sortBy([toDrop.start[2], toDrop.end[2]]);
  const topZ = max(allCells.map(([x, y]) => map[y][x].z));
  const drop = minZ - topZ - 1;

  cells(toDrop).forEach(([x, y]) => {
    const prev = map[y][x];
    if (prev.z <= minZ - drop) {
      if (prev.block && prev.z === minZ - drop - 1 && prev.block !== toDrop) {
        toDrop.supportedBy.add(prev.block);
      }
      prev.block = toDrop;
      prev.z = maxZ - drop;
    }
  });
}

function dropBlocks(input: Input) {
  const maxZ = range(10).map(() => range(10).map(() => ({ z: 0 })));
  const todo = sortBy(input, (b) => max([b.start[2], b.end[2]]));
  todo.forEach((block) => drop(block, maxZ));
}

function part1(input: Input) {
  dropBlocks(input);
  const weak = input.filter((b) => b.supportedBy.size === 1);
  return input.length - uniq(weak.map((b) => [...b.supportedBy][0])).length;
}

function countDamage(block: Block, _: number, input: Input) {
  let gone = new Set([block]);
  const todo = sortBy(input, (b) => max([b.start[2], b.end[2]]));
  for (const nextBlock of todo) {
    const newSupport = [...nextBlock.supportedBy].filter((b) => !gone.has(b));
    if (newSupport.length === 0 && nextBlock.supportedBy.size > 0) {
      gone.add(nextBlock);
    }
  }
  return gone.size - 1;
}

function part2(input: Input) {
  dropBlocks(input);
  return sum(input.map(countDamage));
}

solve({ part1, test1: 5, part2, test2: 7, parser });
