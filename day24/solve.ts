import { chunk, range, sortBy, sum, zip } from 'lodash';
import { solve } from '../utils/typescript';

type Coordinate = [x: number, y: number];
type Line = [
  [x: number, y: number, z: number],
  [dx: number, dy: number, dz: number],
];
type Input = Line[];

function parseLine(line: string): Line {
  return chunk(line.match(/-?\d+/g).map(Number), 3) as Line;
}

function parser(input: string): Input {
  return input.split('\n').map(parseLine);
}

function intersect([[x1, y1], [dx1, dy1]]: Line, [[x2, y2], [dx2, dy2]]: Line) {
  const [slope1, slope2] = [dy1 / dx1, dy2 / dx2];
  const [intercept1, intercept2] = [y1 - slope1 * x1, y2 - slope2 * x2];

  const x = (intercept2 - intercept1) / (slope1 - slope2);
  const y = slope1 * x + intercept1;

  const [t1, t2] = [(x - x1) / dx1, (x - x2) / dx2];
  const neverMeets = slope1 === slope2 || t1 < 0 || t2 < 0;
  return (neverMeets ? [Infinity, Infinity] : [x, y]) as Coordinate;
}

function inArea([x, y]: Coordinate, [[x1, y1], [x2, y2]]: Coordinate[]) {
  return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

const realArea: Coordinate[] = [
  [2e14, 2e14],
  [4e14, 4e14],
];
const testArea: Coordinate[] = [
  [7, 7],
  [27, 27],
];
function part1(input: Input, isTest: boolean) {
  const targetArea = isTest ? testArea : realArea;
  const pairs = input.flatMap((line) => input.map((other) => [line, other]));
  const intersects = pairs.filter(([line, other]) => {
    return inArea(intersect(line, other), targetArea);
  }).length;
  return intersects / 2;
}

function gcd(a: number, b: number) {
  return b == 0 ? a : gcd(b, a % b);
}

function nextPrime(a: bigint, b: bigint, base = 1n, mod = 0n) {
  if (a <= 1n) return base;
  return nextPrime(b, a % b, mod, base - (a / b) * mod);
}

function part2(input: Input) {
  const [sumsOfPos, sumsOfDx] = zip(...input).map((v) => v.map(sum));
  const res = range(-1000, 1000).map((answer) => {
    let basesAndMods = zip(sumsOfPos, sumsOfDx).map(([p, dx]) => [
      Math.abs(dx - answer),
      p % (dx - answer),
    ]);
    basesAndMods = sortBy(basesAndMods, ([m]) => -m);

    const bases: bigint[] = [];
    const mods: bigint[] = [];
    while (basesAndMods.length > 0) {
      const [base, mod] = basesAndMods.shift();
      bases.push(BigInt(base));
      mods.push(BigInt(mod));
      basesAndMods = basesAndMods.filter(([m]) => gcd(m, base) === 1);
    }

    const product = bases.reduce((acc, n) => acc * n, 1n);
    const inverses = bases.map((base) => product / base);

    const multiples = zip(bases, inverses).map(
      ([base, inverse]) => inverse * nextPrime(inverse, base),
    );
    const sums = zip(multiples, mods).reduce(
      (acc, [mul, mod]) => acc + mul * mod,
      0n,
    );
    const remainder = sums % product;
    const positiveInt = (n: number) => n === Math.floor(n) && n > 0;
    const isDone = zip(sumsOfPos, sumsOfDx).every(([pos, dx]) => {
      return positiveInt((Number(remainder) - pos) / (dx - answer));
    });
    return isDone ? remainder : 0;
  });
  return Number(res.find((v) => v));
}

solve({ part1, test1: 2, part2, parser });
