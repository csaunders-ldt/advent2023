import { max, min, range, sortBy, uniq } from 'lodash';
import { solve } from '../utils/typescript';

type Coordinate = [x: number, y: number, z: number];
type Block = {
  start: Coordinate;
  end: Coordinate;
  supportedBy: Set<Block>;
};
type Input = Block[];

function parseLine(line: string): Coordinate {
  return line.split(',').map(Number) as Coordinate;
}

function parser(input: string): Input {
  return input.split('\n').map((l) => {
    const [start, end] = l.split('~').map(parseLine);
    return { start, end, supportedBy: new Set<Block>() };
  });
}

function cells({ start: [x, y, z], end: [x2, y2, z2] }: Block): Coordinate[] {
  return range(x, x2 + 1)
    .map((x) =>
      range(y, y2 + 1).map((y) => range(z, z2 + 1).map((z) => [x, y, z])),
    )
    .flat(2) as Coordinate[];
}

type MaxZMap = { z: number; block?: Block }[][];
function drop(block: Block, map: MaxZMap) {
  const allCells = cells(block);
  const minZ = min([block.start[2], block.end[2]]);
  const topZ = max(allCells.map(([x, y]) => map[y][x].z));
  const drop = max([minZ - topZ - 1, 0]);
  allCells.forEach(([x, y, z]) => {
    const previousBest = map[y][x];
    if (previousBest.z <= z - drop) {
      if (
        previousBest.block &&
        previousBest.z === z - drop - 1 &&
        previousBest.block !== block
      ) {
        block.supportedBy.add(previousBest.block);
      }
      previousBest.block = block;
      previousBest.z = z - drop;
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
  const weakLinks = input.filter((b) => b.supportedBy.size === 1);
  return (
    input.length - uniq(weakLinks.map((b) => [...b.supportedBy][0])).length
  );
}

function part2(input: Input) {
  dropBlocks(input);
  let count = 0;
  for (const block of input) {
    let gone = new Set([block]);
    const todo = sortBy(input, (b) => max([b.start[2], b.end[2]]));
    for (const nextBlock of todo) {
      const newSupport = [...nextBlock.supportedBy].filter((b) => !gone.has(b));
      if (newSupport.length === 0 && nextBlock.supportedBy.size > 0) {
        gone.add(nextBlock);
      }
    }
    count += gone.size - 1;
  }
  return count;
}

solve({ part1, test1: 5, part2, test2: 7, parser });
