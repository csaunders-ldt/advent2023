import { map, memoize, split, sum } from 'lodash';
import { solve } from '../utils/typescript';

type Row = [spaces: ('?' | '.' | '#')[], springs: number[]];
type Input = Row[];

function parseLine(line: string) {
  const [cells, springSet] = line.split(' ');
  const spaces = split(cells, '') as ('?' | '.' | '#')[];
  return [spaces, split(springSet, ',').map(Number)] as Row;
}

function parser(input: string): Input {
  return input.split('\n').map(parseLine);
}

function solveRow([[curr, ...next], springs]: Row, current = 0) {
  if (curr === '?')
    return (
      memoSolve([['#', ...next], springs], current) +
      memoSolve([['.', ...next], springs], current)
    );

  if (curr === '#') {
    return memoSolve([next, springs], current + 1);
  }
  if (current) {
    if (current !== springs[0]) return 0;
    return memoSolve([next, springs.slice(1)], 0);
  }
  if (!curr) return springs.length === 0;

  return memoSolve([next, springs]);
}

function solveLine([spaces, springs]: Row) {
  memoSolve = memoize(solveRow, (...args) => JSON.stringify(args));
  return solveRow([spaces, springs]);
}

let memoSolve = memoize(solveRow, (...args) => JSON.stringify(args));

function part1(input: Input) {
  return sum(map(input, solveLine));
}

function repeat<T>(item: T[], n: number): T[] {
  return Array.from({ length: n }, () => item).flat() as T[];
}

function part2(input: Input) {
  const lines = input.map(([l, s]) => [
    repeat([...l, '?'], 5).slice(0, -1),
    repeat(s, 5),
  ]);

  return sum(map(lines, solveLine));
}

solve({ part1, test1: 21, part2, test2: 525152, parser });
