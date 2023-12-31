import {
  entries,
  flatten,
  forEach,
  map,
  max,
  min,
  range,
  values,
} from 'lodash';

export function printGrid<T = string>(
  grid: T[][],
  toString = (x: T) => String(x),
) {
  console.log(grid.map((row) => row.map(toString).join('')).join('\n') + '\n');
}

export function toVisualisation(grid: string[][]): Record<string, Point[]> {
  const points: Record<string, Point[]> = {};
  grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell === '.') return;
      if (!points[cell]) points[cell] = [];
      points[cell].push([x, y]);
    }),
  );
  return points;
}

export type Point = [x: number, y: number];
export function visualisePoints(points: Record<string, Point[]>) {
  const xs = map(flatten(values(points)), ([x]) => x);
  const ys = map(flatten(values(points)), ([, y]) => y);
  const grid = map(range(max(ys) - min(ys) + 1), () =>
    map(range(max(xs) - min(ys) + 1), () => '.'),
  );
  forEach(entries(points), ([key, points]) =>
    forEach(points, ([x, y]) => (grid[y - min(ys)][x - min(xs)] = key)),
  );
  printGrid(grid);
}
