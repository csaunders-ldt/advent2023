import { solve } from '../utils/typescript';

type Coordinate = [number, number];
type WallDescription = { dir: number; length: number; color: string };
type Input = WallDescription[];

function move([x, y]: Coordinate, dir: number, n: number): Coordinate {
  return [x + ((2 - dir) % 2) * n, y + ((dir - 1) % 2) * n];
}

const dirs = ['U', 'R', 'D', 'L'];
function parseLine(line: string): WallDescription {
  const [dir, length, color] = line.split(' ');
  return { dir: dirs.indexOf(dir), length: +length, color };
}

function parser(input: string): Input {
  return input.split('\n').map(parseLine);
}

function part1(input: Input) {
  let pos: Coordinate = [0, 0];
  let perimeter = 0;
  let area = 0;

  input.forEach(({ dir, length }) => {
    const [startX, startY] = pos;
    pos = move(pos, dir, length);
    perimeter += length;
    area += startX * pos[1] - startY * pos[0];
  });
  const interior = Math.floor((Math.abs(area) - perimeter) / 2) + 1;
  return perimeter + interior;
}

function part2(input: Input) {
  const mappedInput = input.map(({ color }) => ({
    length: parseInt(color.slice(2, -2), 16),
    dir: (parseInt(color.at(-2)) + 1) % 4,
    color,
  }));
  return part1(mappedInput);
}

solve({ part1, test1: 62, part2, test2: 952408144115, parser });
