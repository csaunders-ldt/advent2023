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
  if (cell(pos, grid) !== '.') return false; //REMOVEME

  const neighbours = range(4).map((dir) => move(pos, dir));
  if (pos[0] === 103 && pos[1] == 125) {
    console.log({
      cells: neighbours.map((p) => cell(p, grid)),
      val: neighbours.map((p) => slides.includes(cell(p, grid))),
      res: neighbours.filter((p) => slides.includes(cell(p, grid))).length > 1,
    });
  }
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
  if (!isJunction(pos, grid) && opts.length === 0) {
    console.log({
      pos,
      vals: nextPos(pos, grid).map((p) => [
        seen.has(String(p)),
        routeMap[String(p)],
      ]),
    });
  }
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

function dfsAgain(junctions: RouteMap) {
  let seen = new Set<string>();
  let todo = [{ pos: keys(junctions)[0], score: 0 }];
  let maxScore = 0;
  while (todo.length > 0) {
    const { pos, score } = todo.pop();

    const links = entries(junctions[pos] ?? ({} as RouteMap[string]))
      .filter(([p]) => !seen.has(p))
      .map(([p, dist]) => ({
        pos: p,
        score: score + dist,
        seen: new Set([...seen, p]),
      }));
    todo.push(...links);
    maxScore = max([maxScore, ...todo.map(({ score }) => score)]);
  }
  return maxScore - 1;
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
  return dfsAgain(routes);
}

function part2(input: Input) {
  const junctions = range(input.length).flatMap((y) =>
    range(input[0].length)
      .map((x) => [x, y])
      .filter(([x, y]) => isJunction([x, y], input)),
  );
  console.log(junctions);
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
