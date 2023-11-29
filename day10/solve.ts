import { forEach } from 'lodash';
import { solve } from '../utils/typescript';

function parser(input: string) {
  return input.replace(/a/g, 'noop\na').split(/\r?\n/);
}

function part1(instructions: string[]) {
  let value = 1;
  let strength = 0;
  forEach(instructions, (line, i) => {
    const [op, arg] = line.split(' ');
    if (i % 40 == 19) {
      strength += value * (i + 1);
    }
    if (op === 'noop') return;
    value += +arg;
  });
  return strength;
}

function part2(instructions: string[]) {
  let value = 1;
  let register = '';
  forEach(instructions, (line, i) => {
    const [op, arg] = line.split(' ');
    const isLit = Math.abs((i % 40) - value) < 2;
    register += isLit ? '#' : ' ';
    if (i % 40 == 39) {
      register += '\n';
    }
    if (op === 'noop') return;
    value += +arg;
  });
  process.exit(1);
  return register;
}

solve({ part1, test1: 13140, part2, parser });
