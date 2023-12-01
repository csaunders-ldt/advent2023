import { forEach, keys, map, sum, toPairs, values } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

function toNumber(line: string) {
  const justNumbers = line.replace(/[^0-9]/g, '');
  const characters = justNumbers.split('');
  return parseInt(`${characters[0]}${characters.last}`, 10);
}

function part1(_input: string[]) {
  return sum(map(_input, toNumber));
}

const numbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const regexStr = `(${keys(numbers).join('|')}|${values(numbers).join('|')})`;
const startRegex = new RegExp(regexStr);
const endRegex = new RegExp(`.*${regexStr}`);

function toDigit(value: string) {
  return numbers[value] || value;
}

function toAdvancedNumber(input: string) {
  const firstMatch = input.match(startRegex)[1];
  const lastMatch = input.match(endRegex)[1];
  return parseInt(`${toDigit(firstMatch)}${toDigit(lastMatch)}`);
}

function part2(_input: string[]) {
  return sum(map(_input, toAdvancedNumber));
}

solve({ part1, test1: 142, part2, test2: 281, parser: parseLines() });
