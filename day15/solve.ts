import {
  entries,
  map,
  partial,
  partialRight,
  reduce,
  remove,
  split,
  sum,
  sumBy,
} from 'lodash';
import { solve } from '../utils/typescript';

type Input = string[];
const parser = (l: string) => l.split(',');

function hash(current: number, char: string) {
  return ((char.charCodeAt(0) + current) * 17) % 256;
}

function part1(input: Input) {
  return sum(map(input, (l) => reduce(l, hash, 0)));
}

type Result = Record<string, Record<string, number>>;
function part2(input: Input) {
  const result = input.reduce((acc, l) => {
    const [_, key, op, value] = l.match(/(\w+)(.)(\d*)/);
    const box = (acc[reduce(key, hash, 0)] ||= {});
    if (op === '-') {
      delete box[key];
    } else {
      box[key] = parseInt(value, 10);
    }
    return acc;
  }, {} as Result);
  return sumBy(entries(result), ([box, vals]) =>
    sum(map(entries(vals), ([_, v], i) => (+box + 1) * +v * (i + 1))),
  );
}

solve({ part1, test1: 1320, part2, test2: 145, parser });
