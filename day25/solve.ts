import { keys, sum } from 'lodash';
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

function part1(map: Input) {
  const [set1, set2] = [keys(map), []];
  const wrongSet = (v: string) => map[v].filter((v) => set2.includes(v)).length;
  do {
    set2.push(set1.sort((a, b) => wrongSet(a) - wrongSet(b)).pop());
  } while (sum(set1.map(wrongSet)) != 3);
  return set1.length * set2.length;
}

function part2(input: Input) {
  return 'I WIN';
}

solve({ part1, test1: 54, part2, test2: 'I WIN', parser });
