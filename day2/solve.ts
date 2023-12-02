import { max, sum, sumBy } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

type CubeCount = {
  game: number;
  red: number;
  blue: number;
  green: number;
};

function maxCounts(line: string, colour: string) {
  const match = line.match(new RegExp(`\\d+ ${colour}`, 'g'));
  const counts = (match ?? []).map((l) => l.match(/\d+/)).map(Number);
  return max(counts);
}

function countCubes(line: string, i: number): CubeCount {
  return {
    game: i + 1,
    red: maxCounts(line, 'red'),
    blue: maxCounts(line, 'blue'),
    green: maxCounts(line, 'green'),
  };
}

function part1(input: CubeCount[]) {
  const validInputs = input.filter(
    ({ red, blue, green }) => red < 13 && blue < 15 && green < 14,
  );
  return sumBy(validInputs, 'game');
}

function part2(input: CubeCount[]) {
  const scores = input.map(({ red, blue, green }) => red * blue * green);
  return sum(scores);
}

solve({
  part1,
  test1: 8,
  part2,
  test2: 2286,
  parser: (input) => input.split('\n').map(countCubes),
});
