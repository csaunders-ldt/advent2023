import { filter, map, min, partial, range } from 'lodash';
import { parseGrid, solve } from '../utils/typescript';
import { aStar, Path } from '../utils/typescript/pathfinding';

type Position = [x: number, y: number];

function getNodes(grid: string[][], letter: string): Position[] {
  return range(grid[0].length)
    .flatMap((x) => range(grid.length).map((y) => [x, y] as Position))
    .filter((pos) => grid[pos[1]][pos[0]] === letter)!;
}

function getMatchingSiblings(grid: string[][], position: Position): Position[] {
  const [x, y] = position;
  const candidates: Position[] = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];
  const c = grid[y][x] == 'S' ? 96 : grid[y][x].charCodeAt(0);
  return candidates.filter(([x2, y2]) => {
    const char = grid[y2]?.[x2];
    if (char === 'E') return c >= 122;
    return char?.charCodeAt(0) <= c + 1;
  });
}

function getDistance(grid: string[][], startNode: Position): number {
  const isFinalNode = (pos: Position) => grid[pos[1]][pos[0]] === 'E';
  const getSiblings = partial(getMatchingSiblings, grid);
  const heuristic = (path: Path<Position>) => path.length;
  const path = aStar(startNode, getSiblings, isFinalNode, heuristic);
  return path.length - 1;
}

function part1(grid: string[][]) {
  return getDistance(grid, getNodes(grid, 'S')[0]);
}

function part2(grid: string[][]) {
  const nodes = [...getNodes(grid, 'a'), getNodes(grid, 'S')[0]];
  const distances = map(nodes, partial(getDistance, grid));
  return min(filter(distances, (v) => v !== -1))!;
}

solve({ part1, test1: 31, part2, test2: 29, parser: parseGrid });
