import { invert, map, max, min, split, sum } from 'lodash';
import { solve } from '../utils/typescript';

const toDecimal = { '0': 0, '1': 1, '2': 2, '-': '-1', '=': '-2' };

function fromSnafu(input: string): number {
  return input.split('').reduce((acc, digit) => acc * 5 + +toDecimal[digit], 0);
}

function parser(input: string) {
  return map(split(input, '\n'), fromSnafu);
}

const decimalToDigit = invert(toDecimal);
function toSnafu(number: number, carry = 0): string {
  if (number === 0) return carry === 0 ? '' : decimalToDigit[carry];

  const total = (number % 5) + carry;
  const cycled = ((total + 2) % 5) - 2;
  const c = total > 2 ? 1 : 0;
  return toSnafu(Math.floor(number / 5), c) + decimalToDigit[cycled];
}

function part1(numbers: number[]) {
  return toSnafu(sum(numbers));
}

function part2(numbers: number[]) {
  throw new Error('Click the button yourself you lazy sod');
}

solve({ part1, test1: '2=-1=0', part2, parser });
