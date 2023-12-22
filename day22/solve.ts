import { groupBy, max, min, range, remove, sortBy, zip } from 'lodash';
import { solve } from '../utils/typescript';

type Coordinate = [x: number, y: number, z: number];
type Block = {
  start: Coordinate;
  end: Coordinate;
  supporting: Set<Block>;
  supportedBy: Set<Block>;
  resting: boolean;
  char: string;
  supportChar: Set<String>;
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
      resting: false,
      char: String.fromCharCode(65 + i),
      supportChar: new Set<String>(),
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

type MaxZMap = { z: number; block: Block | null }[][];
function drop(block: Block, map: MaxZMap) {
  const allCells = cells(block);
  const minZ = min([block.start[2], block.end[2]]);
  const topZ = max(allCells.map(([x, y]) => map[y][x].z));
  const drop = max([minZ - topZ - 1, 0]);
  // console.log(
  //   `Dropping ${block.char} by ${drop} (topZ is ${topZ}, minZ is ${minZ})`,
  // );
  allCells.forEach(([x, y, z]) => {
    const previousBest = map[y][x];
    if (previousBest.z <= z - drop) {
      // console.log(
      //   `Previously ${previousBest.z} as ${previousBest.block?.char} vs ${
      //     z - drop - 1
      //   }`,
      // );
      if (
        previousBest.block &&
        previousBest.z === z - drop - 1 &&
        previousBest.block.char !== block.char
      ) {
        previousBest.block.supporting.add(block);
        previousBest.block.supportChar.add(block.char);
        block.supportedBy.add(previousBest.block);
      }
      previousBest.block = block;
      previousBest.z = z - drop;
      // console.log(`Set (${x}, ${y}) to ${previousBest.z} for ${block.char}`);
    }
  });
}

function dropBlocks(input: Input) {
  const maxZ = range(10).map(() =>
    range(10).map(() => ({ z: 1, block: null })),
  );

  const todo = sortBy(input, (b) => max([b.start[2], b.end[2]]));
  todo.forEach((block) => drop(block, maxZ));
}

function part1(input: Input, isTest: boolean) {
  dropBlocks(input);
  console.log(input);
  console.log(
    input.filter((b) =>
      [...b.supporting].every((target) => target.supportedBy.size !== 1),
    ).length,
  );
  if (!isTest) {
    process.exit(0);
  }
  return input.filter((b) =>
    [...b.supporting].every((target) => target.supportedBy.size !== 1),
  ).length;
}

function part2(input: Input) {
  return input;
}

solve({ part1, test1: 5, part2, test2: [], parser });
