import { range, sum } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

type Numbers = [winningNumbers: number[], myNumbers: number[]];

function splitNumbers(line: string): Numbers {
  const getNumbers = (x: string) => [...x.matchAll(/\d+/g)].map(Number);
  const [winning, yours] = line.split('|').map(getNumbers);
  return [winning.slice(1), yours];
}

function part1(input: Numbers[]) {
  const scores = input.map(([winning, mine]) => {
    const dupes = mine.filter((x) => winning.includes(x)).length;
    return dupes === 0 ? 0 : 2 ** (dupes - 1);
  });
  return sum(scores);
}

function part2(input: Numbers[]) {
  let score = 0;
  let copies = Array(input.length).fill(1);
  for (const [winning, mine] of input) {
    const count = copies.shift();
    score += count;
    const dupes = mine.filter((x) => winning.includes(x)).length;
    range(dupes).forEach((i) => (copies[i] += count));
  }
  return score;
}

solve({
  part1,
  test1: 13,
  part2,
  test2: 30,
  parser: parseLines({ mapFn: splitNumbers }),
});
