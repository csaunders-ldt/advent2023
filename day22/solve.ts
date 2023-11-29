import {
  clone,
  every,
  filter,
  find,
  findIndex,
  flatMap,
  forEach,
  groupBy,
  identity,
  map,
  mapValues,
  partial,
  range,
  split,
} from 'lodash';
import { solve } from '../utils/typescript';

type Cell = {
  x: number;
  y: number;
  value: string;
  next: State[];
};
type State = { cell: Cell; facing: number };
type Input = { cells: Cell[]; instructions: string[] };

function parser(input: string): Input {
  const [grid, lines] = split(input, '\n\n');
  const maybeCells = flatMap(split(grid, '\n'), (row, y) =>
    map(split(row, ''), (value, x) => ({ x, y, value, next: [] })),
  );
  const cells = filter(maybeCells, ({ value }) => value !== ' ');
  const instructions = lines.match(/([A-Z]+|\d+)/g);
  return { cells, instructions };
}

function rotate(value: number, turns: number): number {
  return (value + turns + 4) % 4;
}

function move(state: State, distance: number): State {
  if (distance === 0) return state;
  const next = state.cell.next[state.facing];
  return next.cell.value === '#' ? state : move(next, distance - 1);
}

function execute(input: Input, state: State) {
  forEach(input.instructions, (instruction) => {
    if (instruction === 'L' || instruction === 'R') {
      state.facing = rotate(state.facing, instruction === 'L' ? -1 : 1);
    } else {
      state = mapValues(move(state, +instruction), clone) as State;
    }
  });
  return (state.cell.y + 1) * 1000 + (state.cell.x + 1) * 4 + state.facing;
}

function getNext(cell: Cell, loop = false, cells: Cell[], reverse = false) {
  const alt = loop ? (reverse ? cells.last : cells[0]) : null;
  return cells[findIndex(cells, cell) + (reverse ? -1 : 1)] || alt;
}

function link({ cells }: Input, loop = false) {
  const [cols, rows] = [groupBy(cells, 'x'), groupBy(cells, 'y')];
  forEach(cells, (cell) => {
    const [col, row] = [cols[cell.x], rows[cell.y]];
    const get = partial(getNext, cell, loop);
    const next = [get(row), get(col), get(row, true), get(col, true)];
    cell.next = map(next, (position, facing) => ({ cell: position, facing }));
    cell.next = map(cell.next, (state) => (state.cell ? state : null));
  });
}

function part1(input: Input) {
  link(input, true);
  return execute(input, { facing: 0, cell: input.cells[0] });
}

function isCorner({ next }: Cell, i: number, j: number) {
  return next[i] && !next[i].cell.next[j] && next[j] && !next[j].cell.next[i];
}

function attach(l: Cell, r: Cell, lDir: number, rDir = rotate(lDir, 1)) {
  l.next[rotate(lDir, 1)] = { cell: r, facing: rotate(rDir, 1) };
  r.next[rotate(rDir, 3)] = { cell: l, facing: rotate(lDir, 3) };
  if (!l.next[lDir] && !r.next[rDir]) return;

  if (!l.next[lDir]) {
    lDir = rotate(lDir, 3);
  } else {
    l = l.next[lDir].cell;
  }
  if (!r.next[rDir]) {
    rDir = rotate(rDir, 1);
  } else {
    r = r.next[rDir].cell;
  }
  if (every(l.next, identity) || every(r.next, identity)) return;

  attach(l, r, lDir, rDir);
}

function fold(cell: Cell) {
  let lDir = find(range(4), (i) => isCorner(cell, i, rotate(i, 1)));
  if (lDir === undefined) return;
  attach(cell.next[lDir].cell, cell.next[rotate(lDir, 1)].cell, lDir);
}

function part2(input: Input) {
  link(input);
  forEach(input.cells, fold);
  return execute(input, { facing: 0, cell: input.cells[0] });
}

solve({ part1, test1: 6032, part2, test2: 5031, parser });
