import { find, identity, range, uniq } from 'lodash';
import { solve } from '../utils/typescript';

function part1(s: string) {
  return find(range(s.length), (i) => uniq(s.slice(i - 4, i)).length === 4);
}

function part2(s: string) {
  return find(range(s.length), (i) => uniq(s.slice(i - 14, i)).length === 14);
}

solve({ part1, test1: 6, part2, parser: identity });
