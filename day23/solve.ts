import { entries, keys, max, range } from 'lodash';
import { solve, toVisualisation, visualisePoints } from '../utils/typescript';

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

function isJunction(pos: Coordinate, grid: Input) {
  const neighbours = range(4).map((dir) => move(pos, dir));
  return neighbours.filter((p) => slides.includes(cell(p, grid))).length > 1;
}

const slides = ['^', '>', 'v', '<'];
function nextPos(state: Coordinate, grid: Input) {
  const slide = slides.indexOf(cell(state, grid));
  if (slide !== -1) {
    return [move(state, slide)];
  }
  const opts = range(4).map((dir) => move(state, dir));
  return opts.filter(
    (pos, dir) =>
      cell(pos, grid) === '.' || slides.indexOf(cell(pos, grid)) === dir,
  );
}

function next(
  { pos, lastJunction, length }: Junction,
  grid: Input,
  routeMap: RouteMap,
  seen: Set<string>,
): Junction[] {
  seen.add(String(pos));
  const opts = nextPos(pos, grid).filter(
    (p) => !seen.has(String(p)) || routeMap[String(p)],
  );
  if (isJunction(pos, grid) || opts.length === 0) {
    const routes = (routeMap[String(lastJunction)] ??= {});
    routes[String(pos)] = length + 1;
    routeMap[String(pos)] ??= {};
    return opts.map((opt) => ({ pos: opt, lastJunction: pos, length: 0 }));
  }
  if (!opts.length) {
    return [];
  }
  return [{ pos: opts[0], lastJunction, length: length + 1 }];
}

type Node = { idx: bigint; neighbours: { dist: number; node: Node }[] };
function recursiveDfs(node: Node, seen: bigint) {
  const neighbours = node.neighbours.filter(({ node }) => !(node.idx & seen));
  if (!neighbours.length) return 0;

  return max(
    neighbours.map((n) => n.dist + recursiveDfs(n.node, seen | node.idx)),
  );
}

function dfsAgain(junctions: RouteMap) {
  const entryKeys = keys(junctions);
  const recursable = Object.entries(junctions).map(([k, v], i) => {
    return { idx: BigInt(2 ** i), neighbours: [] };
  });
  Object.entries(junctions).forEach(([_, vals], i) => {
    Object.entries(vals).forEach(([k, v]) => {
      recursable[i].neighbours.push({
        dist: v,
        node: recursable[entryKeys.indexOf(k)],
      });
    });
  });
  return recursiveDfs(recursable[0] as Node, 0n) - 1;
}

type Junction = { pos: Coordinate; lastJunction: Coordinate; length: number };
type RouteMap = Record<string, Record<string, number>>;

function dfs(state: Junction[], grid: Input) {
  let routes: RouteMap = {};
  let seen = new Set<string>(state.map(({ pos }) => String(pos)));
  while (state.length > 0) {
    state.push(...next(state.shift(), grid, routes, seen));
  }
  return routes;
}

function part1(input: Input) {
  const routes = dfs([{ pos: [1, 0], lastJunction: [0, 0], length: 0 }], input);
  console.log(routes);
  return dfsAgain(routes);
}

function part2(input: Input) {
  const routes = dfs([{ pos: [1, 0], lastJunction: [0, 0], length: 0 }], input);
  keys(routes)
    .filter((k) => k !== '0,0')
    .forEach((k) => {
      entries(routes[k]).forEach(([pos, dist]) => {
        if (routes[pos]) {
          routes[pos][k] = dist;
        }
      });
    });
  console.log(routes);
  return dfsAgain(routes);
}

solve({ part1, test1: 94, part2, test2: 154, parser });
