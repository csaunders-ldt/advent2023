import { forEach, range } from 'lodash';
import { solve } from '../utils/typescript';

function parser(input: string) {
  return input.replace(/:/g, '=').split('\n');
}

function consume(instructions: string[]): Record<string, number> {
  const remainingInstructions = [...instructions];
  const values: Record<string, number> = {};
  while (remainingInstructions.length > 0) {
    const instruction = remainingInstructions.shift();
    eval(instruction.replace(/[a-z]+/g, (v) => `values.${v}`));
    if (Number.isNaN(values[instruction.slice(0, 4)])) {
      remainingInstructions.push(instruction);
    }
  }
  return values;
}

function part1(instructions: string[]) {
  return consume(instructions).root;
}

function part2(instructions: string[]) {
  const humanLine = instructions.findIndex((line) => line.startsWith('humn'));
  const rootLine = instructions.findIndex((line) => line.startsWith('root'));
  instructions[rootLine] = instructions[rootLine].replace('+', '-');
  const test = (testValue: BigInt) => {
    instructions[humanLine] = `humn = ${testValue}`;
    return consume(instructions).root;
  };

  let guess = 0n;
  const isNegative = test(0n) < 0;
  forEach(range(61, 0), (i) => {
    const mask = 1n << BigInt(i);
    if (test(guess | mask) < 0 === isNegative) {
      guess |= mask;
    }
  });
  return Number(guess) + (isNegative ? 1 : 0);
}

solve({ part1, test1: 152, part2, test2: 301, parser });
