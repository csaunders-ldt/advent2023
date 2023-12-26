import {
  countBy,
  entries,
  fromPairs,
  keys,
  remove,
  sampleSize,
  sortBy,
  sum,
  times,
  uniq,
} from 'lodash';
import { solve } from '../utils/typescript';

type Input = Record<string, string[]>;

function parser(input: string): Input {
  const result: Input = {};
  input.split('\n').forEach((line) => {
    const [key, ...values] = line.match(/(\w+)/g);
    values.forEach((value) => {
      (result[value] ??= []).push(key);
      (result[key] ??= []).push(value);
    });
  });
  return result;
}

function part1(input: Input) {
  const [group1, group2] = [new Set(keys(input)), new Set<string>()];
  const wrongSet = (v: string) => input[v].filter((v) => group2.has(v)).length;
  do {
    const key = sortBy([...group1], (v) => wrongSet(v)).at(-1);
    group1.delete(key);
    group2.add(key);
  } while (sum([...group1].map(wrongSet)) != 3);
  return group1.size * group2.size;
}

function part2(input: Input) {
  return 'I WIN';
}

solve({ part1, test1: 54, part2, test2: 'I WIN', parser });
