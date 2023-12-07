import { groupBy, sortBy, sum, values } from 'lodash';
import { solve } from '../utils/typescript';

function parser(input: string) {
  return input.split('\n').map((l) => l.split(' '));
}

function sub(cards: string) {
  return cards.replaceAll('A', 'Z').replaceAll('K', 'Y').replaceAll('T', 'B');
}

function score([cards]: string[]) {
  if (cards === '11111') return '5,011111';
  const jacks = cards.split('').filter((c) => c === '1').length;
  const groups = groupBy(cards.replace('1', '').split(''));
  const groupLengths = values(groups).map((v) => v.length);
  const [rank1, rank2] = groupLengths.sort().reverse().slice(0, 2);
  return `${rank1 + jacks}${rank2 ?? 0}${sub(cards)}`;
}

function sumScore(sortedHands: string[][]) {
  return sum(sortedHands.map(([_, score], i) => Number(score) * (i + 1)));
}

function part1(input: string[][]) {
  return sumScore(sortBy(input, score));
}

function part2(input: string[][]) {
  const mappedInput = input.map(([cards, v]) => [cards.replace(/J/g, '1'), v]);
  return sumScore(sortBy(mappedInput, score));
}

solve({ part1, test1: 6440, part2, test2: 5905, parser });
