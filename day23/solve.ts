import { max, range } from 'lodash';
import { solve } from '../utils/typescript';

type Coordinate = [x: number, y: number];
type Input = string[][];

function parser(input: string): Input {
  return input.split('\n').map((l) => l.split(''));
}

function cell([x, y]: Coordinate, grid: Input) {
  return grid[y]?.[x];
}

function move([x, y]: Coordinate, dir: number, n = 1): Coordinate {
  return [x + ((2 - dir) % 2) * n, y + ((dir - 1) % 2) * n];
}

function eq([x1, y1]: Coordinate, [x2, y2]: Coordinate) {
  return x1 === x2 && y1 === y2;
}

const slides = ['^', '>', 'v', '<'];
function isJunction(pos: Coordinate, grid: Input) {
  const neighbours = range(4).map((dir) => move(pos, dir));
  // TODO: Just count non-hash
  return neighbours.filter((p) => slides.includes(cell(p, grid))).length > 1;
}

type Node = { idx: bigint; next: { dist: number; node: Node }[] };
function dfs(node: Node, seen: bigint, target: bigint) {
  const neighbours = node.next.filter(({ node }) => !(node.idx & seen));
  if (!neighbours.length) {
    return node.idx === target ? 0 : -9999;
  }

  return max(
    neighbours.map((n) => n.dist + dfs(n.node, seen | node.idx, target)),
  );
}

function neighbours(cell: Coordinate) {
  return range(4).map((dir) => move(cell, dir));
}

function part1(input: Input) {
  return -1;
}

function follow(curr: Coordinate, prev: Coordinate, grid: Input, len = 1) {
  if (isJunction(curr, grid)) return { curr, len };
  const next = neighbours(curr).find(
    (n) => cell(n, grid) && cell(n, grid) !== '#' && !eq(prev, n),
  );
  if (!next) return { curr, len };
  return follow(next, curr, grid, len + 1);
}

function part2(input: Input) {
  const junctions = range(input.length).flatMap((y) =>
    range(input[0].length)
      .map((x) => [x, y] as Coordinate)
      .filter(
        ([x, y]) => cell([x, y], input) !== '#' && isJunction([x, y], input),
      ),
  );
  junctions.unshift([1, 0]);
  junctions.push([input.length - 2, input.length - 1]);
  const nodes = junctions.map(
    (_, i) =>
      ({
        idx: BigInt(2 ** i),
        next: [],
      }) as Node,
  );
  nodes.forEach((node, i) => {
    const siblings = neighbours(junctions[i])
      .filter((v) => cell(v, input) && cell(v, input) !== '#')
      .map((loc) => follow(loc, junctions[i], input));
    const nextNodes = siblings.map(({ curr, len }) => ({
      node: nodes[junctions.findIndex((j) => eq(curr, j))],
      dist: len,
    }));
    node.next.push(...nextNodes);
  });

  return dfs(nodes[0], 0n, nodes.at(-1).idx);
}

solve({ part1, test1: 94, part2, test2: 154, parser });
