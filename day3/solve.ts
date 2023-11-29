import { chunk, map, sumBy } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

function splitInHalf(input: string) {
  const half = Math.floor(input.length / 2);
  return [input.slice(0, half), input.slice(half)];
}

function findCommonLetter(...groups: string[]): string {
  const [first, ...rest] = map(groups, (group) => group.split(''));
  return first.find((letter) => rest.every((group) => group.includes(letter)));
}

function getLetterScore(letter: string) {
  const charCode = letter.charCodeAt(0);
  return charCode < 97 ? charCode - 38 : charCode - 96;
}

function part1(rucksacks: string[]) {
  return sumBy(rucksacks, (rucksack) => {
    const [leftPart, rightPart] = splitInHalf(rucksack);
    const commonLetter = findCommonLetter(leftPart, rightPart);
    return getLetterScore(commonLetter);
  });
}

function part2(rucksacks: string[]) {
  return sumBy(chunk(rucksacks, 3), (rucksackGroup) => {
    const commonLetter = findCommonLetter(...rucksackGroup);
    return getLetterScore(commonLetter);
  });
}

solve({ part1, test1: 157, part2, test2: 70, parser: parseLines() });
