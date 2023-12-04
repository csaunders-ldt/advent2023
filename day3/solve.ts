import { range, sum, uniq } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

type Space = {
  number?: { value: number };
  isPart: boolean;
};

function toSpaces(x: string): Space[] {
  let number = undefined;
  return x.split('').map((c) => {
    if (c.match(/[^0-9]/)) {
      number = undefined;
      return { isPart: c !== '.' };
    }
    if (number) {
      number.value = number.value * 10 + Number(c);
    } else {
      number = { value: Number(c) };
    }
    return { number, isPart: false };
  });
}

function nearbyNumbers(input: Space[][], x: number, y: number): number[] {
  const numbers = range(-1, 2).flatMap((dx) =>
    range(-1, 2).map((dy) => input[y + dy]?.[x + dx]?.number),
  );
  return uniq(numbers.filter((x) => !!x?.value)).map((n) => n.value);
}

function part1(grid: Space[][]) {
  const parts = grid.flatMap((row, y) =>
    row.flatMap((space, x) => (space.isPart ? nearbyNumbers(grid, x, y) : [])),
  );
  return sum(parts);
}

function part2(grid: Space[][]) {
  const parts = grid.flatMap((row, y) =>
    row.map((space, x) => (space.isPart ? nearbyNumbers(grid, x, y) : [])),
  );
  return sum(parts.filter((x) => x.length === 2).map(([l, r]) => l * r));
}

solve({
  part1,
  test1: 4361,
  part2,
  test2: 467835,
  parser: parseLines({ mapFn: toSpaces }),
});
