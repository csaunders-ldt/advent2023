import { solve } from '../utils/typescript';

type Input = string[];

function parser(input: string): Input {
  return input.split('\n').map((l) => l.trim());
}

function part1(_input: Input) {
  return 'part1';
}

function part2(_input: Input) {
  return 'part2';
}

solve({ part1, test1: 'TODO', part2, test2: 'TODO', parser });
