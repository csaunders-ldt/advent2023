import { groupBy, map, reverse, sortBy, sum, values } from 'lodash';
import { solve } from '../utils/typescript';

function parser(input: string) {
  return input.split('\n').map((l) => l.split(' '));
}

function sub(cards: string) {
  return cards.replaceAll('A', 'Z').replaceAll('K', 'Y').replaceAll('T', 'B');
}

function score([cards]: string[]) {
  if (cards === '11111') return '5011111';
  const jackCount = cards.split('').filter((c) => c === '1').length;
  const groups = values(groupBy(cards.replace('1', '').split('')));
  const [rank1, rank2] = reverse(sortBy(map(groups, (v) => v.length)));
  return `${rank1 + jackCount}${rank2 ?? 0}${sub(cards)}`;
}

function sumScore(sortedHands: string[][]) {
  return sum(sortedHands.map(([_, score], i) => Number(score) * (i + 1)));
}

function part1(input: string[][]) {
  return sumScore(sortBy(input, score));
}

function part2(input: string[][]) {
  return sumScore(sortBy(input, ([c, v]) => score([c.replace(/J/g, '1'), v])));
}

solve({ part1, test1: 6440, part2, test2: 5905, parser });
