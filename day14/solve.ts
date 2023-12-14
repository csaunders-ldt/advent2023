import { entries, forEach, sum, sumBy, times, zip } from 'lodash';
import { solve } from '../utils/typescript';

type Input = string[][];

function parser(input: string): Input {
  return input.split('\n').map((l) => l.split(''));
}

function tilt(input: Input) {
  const top = Array(input[0].length).fill(0);
  forEach(input, (row, y) => {
    forEach(row, (cell, x) => {
      if (cell === '#') {
        top[x] = y + 1;
      }

      if (cell === 'O') {
        let pos = top[x];
        while ((input[pos][x] === 'O' || input[pos][x] === '#') && pos < y) {
          pos++;
        }
        input[pos][x] = 'O';
        if (pos !== y) {
          input[y][x] = '.';
        }
      }
    });
  });
}

function score(input: Input) {
  return sum(
    input.flatMap((row, y) =>
      row.map((cell) => (cell === 'O' ? input.length - y : 0)),
    ),
  );
}

function part1(input: Input) {
  tilt(input);
  return score(input);
}

function hash(input: Input) {
  return input.map((row) => row.join('')).join('\n');
}

function rotate(input: Input) {
  return zip(...input).map((row) => row.reverse());
}

function part2(input: Input) {
  const seen: Record<string, number> = {};
  let cycles = 0;
  while (!seen[hash(input)]) {
    seen[hash(input)] = cycles++;
    times(4, () => {
      tilt(input);
      input = rotate(input);
    });
  }
  const cycleStart = seen[hash(input)];
  const cycleLen = cycles - cycleStart;
  const finalPos = ((1000000000 - cycleStart) % cycleLen) + cycleStart;
  const [grid] = entries(seen).find(([_, c]) => c === finalPos);
  return score(parser(grid));
}

solve({ part1, test1: 136, part2, test2: 64, parser });
