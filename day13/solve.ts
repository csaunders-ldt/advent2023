import { findIndex, isArray, map, reduce, sum, sumBy, zip } from 'lodash';
import { getGridParser, solve } from '../utils/typescript';

type Tuple = number | Tuple[];

function compare(a?: Tuple, b?: Tuple): number {
  if (!Array.isArray(a) && !Array.isArray(b)) {
    return a === undefined ? -1 : a - (b ?? -1);
  }
  if (isArray(a) && isArray(b)) {
    const firstPair = zip(a, b).find(([a, b]) => compare(a, b));
    return firstPair ? compare(...firstPair) : -compare(a.length, b.length);
  }
  return isArray(a) ? compare(a, [b]) : compare([a], b);
}

function part1(pairs: Tuple[][]) {
  const score = map(pairs, ([l, r], i) => (compare(l, r) < 0 ? i + 1 : 0));
  return sum(score);
}

function part2(pairs: Tuple[][][]) {
  const tuples = [...pairs.flat(1), [[2]], [[6]]].sort(compare);
  return (
    (findIndex(tuples, (t) => t.toString() === '2') + 1) *
    (findIndex(tuples, (t) => t.toString() === '6') + 1)
  );
}

const parser = getGridParser({
  separator: '\n\n',
  rowSeparator: '\n',
  mapFn: JSON.parse,
});
solve({ part1, test1: 13, part2, test2: 140, parser });
