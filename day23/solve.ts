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

function isJunction(pos: Coordinate, grid: Input) {
  if (cell(pos, grid) == '#') return false;

  const neighbours = range(4).map((dir) => move(pos, dir));
  return neighbours.filter((p) => cell(p, grid) !== '#').length > 2;
}

type Node = { idx: bigint; next: { dist: number; node: Node }[] };
function dfs(node: Node, seen: bigint, end: bigint) {
  const neighbours = node.next.filter(({ node }) => !(node.idx & seen));
  if (!neighbours.length) return node.idx === end ? 0 : -9999;

  return max(neighbours.map((n) => n.dist + dfs(n.node, seen | node.idx, end)));
}

function neighbours(pos: Coordinate, grid: Input) {
  const allNeighbours = range(4).map((dir) => move(pos, dir));
  return allNeighbours.filter((v) => cell(v, grid) && cell(v, grid) !== '#');
}

function follow(curr: Coordinate, prev: Coordinate, grid: Input, dist = 1) {
  const next = neighbours(curr, grid).find((n) => !eq(prev, n));
  if (isJunction(curr, grid) || !next) return { curr, dist };

  return follow(next, curr, grid, dist + 1);
}

const cells = ['^', '>', 'v', '<', '.'];
function rightDir(loc: Coordinate, grid: Input, dir: number) {
  return dir === cells.indexOf(cell(loc, grid)) || cell(loc, grid) === '.';
}

function findSiblings(pos: Coordinate, grid: Input, part2: boolean) {
  const allSiblings = range(4).map((dir) => move(pos, dir));
  const valid = allSiblings.filter((loc, i) => part2 || rightDir(loc, grid, i));
  const notWall = valid.filter((v) => cells.includes(cell(v, grid)));
  return notWall.map((loc) => follow(loc, pos, grid));
}

function getPathLength(grid: Input, part2 = false) {
  const size = grid.length;
  const cells = range(size).flatMap((y) => range(size).map((x) => [x, y]));
  const junctions = cells.filter(([x, y]) => isJunction([x, y], grid));
  junctions.unshift([1, 0], [grid.length - 2, grid.length - 1]);

  const nodes = junctions.map((_, i) => ({ idx: BigInt(2 ** i), next: [] }));
  nodes.forEach((node, i) => {
    const pos = junctions[i] as Coordinate;
    const nextNodes = findSiblings(pos, grid, part2).map(({ curr, dist }) => {
      const node = nodes[junctions.findIndex((j) => eq(curr, j as Coordinate))];
      return { node, dist };
    });
    node.next.push(...nextNodes);
  });

  return dfs(nodes[0], 0n, nodes[1].idx);
}

function part1(grid: Input) {
  return getPathLength(grid);
}

function part2(grid: Input) {
  return getPathLength(grid, true);
}

solve({ part1, test1: 94, part2, test2: 154, parser });
