import { cloneDeep, max, min, range, remove, sortBy, sum } from 'lodash';
import { solve } from '../utils/typescript';

type Coordinate = [x: number, y: number, z: number];
type Block = {
  start: Coordinate;
  end: Coordinate;
  supporting: Set<Block>;
  supportedBy: Set<Block>;
};
type Input = Block[];

function parseLine(line: string): Coordinate {
  return line.split(',').map(Number) as Coordinate;
}

function parser(input: string): Input {
  return input.split('\n').map((l, i) => {
    const [start, end] = l.split('~').map(parseLine);
    return {
      start,
      end,
      supporting: new Set<Block>(),
      supportedBy: new Set<Block>(),
    };
  });
}

function cells(block: Block): Coordinate[] {
  const [x1, y1, z1] = block.start;
  const [x2, y2, z2] = block.end;
  return range(x1, x2 + 1)
    .map((x) =>
      range(y1, y2 + 1).map((y) => range(z1, z2 + 1).map((z) => [x, y, z])),
    )
    .flat(2) as Coordinate[];
}

type MaxZMap = { z: number; block?: Block }[][];
function drop(block: Block, map: MaxZMap, testRun: boolean) {
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
        previousBest.block.supporting.add(block);
        block.supportedBy.add(previousBest.block);
      }
      previousBest.block = block;
      previousBest.z = z - drop;
    }
  });
  if (!testRun) {
    block.start[2] = block.start[2] - drop;
    block.end[2] = block.end[2] - drop;
  }
  return drop;
}

function dropBlocks(input: Input, testRun: boolean) {
  const maxZ = range(10).map(() => range(10).map(() => ({ z: 0 })));

  const todo = sortBy(input, (b) => max([b.start[2], b.end[2]]));
  return sum(todo.map((block) => (drop(block, maxZ, testRun) ? 1 : 0)));
}

function part1(input: Input) {
  dropBlocks(input, false);
  const result = input.filter((b) =>
    [...b.supporting].every((target) => target.supportedBy.size !== 1),
  ).length;
  return result;
}

function part2(input: Input) {
  dropBlocks(input, false);
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
