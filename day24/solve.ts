import { chunk, range, sortBy, sum, zip } from 'lodash';
import { solve } from '../utils/typescript';
import { assert } from 'console';

type Coordinate = [x: number, y: number, z: number];
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
  if (slope1 === slope2 || t1 < 0 || t2 < 0) {
    return [Infinity, Infinity];
  }

  return [x, y];
}

function inArea([x, y]: Coordinate, [[x1, y1], [x2, y2]]: Coordinate[]) {
  return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

// Hailstone A: 19, 13, 30 @ -2, 1, -2
// Hailstone B: 18, 19, 22 @ -1, -1, -2
// Hailstones' paths will cross inside the test area (at x=14.333, y=15.333).

const realArea: Coordinate[] = [
  [2e14, 2e14, 2e14],
  [4e14, 4e14, 4e14],
];
const testArea: Coordinate[] = [
  [7, 7, 7],
  [27, 27, 27],
];
function part1(input: Input, isTest: boolean) {
  const targetArea = isTest ? testArea : realArea;
  const intersects = input.flatMap((line) => {
    return input.map((other) => {
      if (other === line) return 0;

      const [x, y] = intersect(line, other);
      return inArea([x, y, 0], targetArea) ? 1 : 0;
    });
  });
  return sum(intersects) / 2;
}

function gcd(a: number, b: number) {
  return b == 0 ? a : gcd(b, a % b);
}

function part2(input: Input, isTest: boolean) {
  const [sumsOfPos, sumsOfDx] = zip(...input).map((v) => v.map(sum));
  // TODO: This was 1000
  const res = range(380).map((answer) => {
    if (sumsOfDx.includes(answer)) return false;

    let multipleAndRemainder = zip(sumsOfPos, sumsOfDx).map(([p, dx]) => {
      let remainder = p % (dx - answer);
      // This can probably be removed later
      if (dx - answer < 0) remainder += dx - answer;
      // 62 % (-3)
      return [dx - answer, remainder] as const;
    });
    for (const i in range(multipleAndRemainder.length)) {
      // TODO: JS Might just do this
      const [multiple, remainder] = multipleAndRemainder[i];
      if (multiple < 0) {
        multipleAndRemainder[i] = [-multiple, remainder - multiple];
      }
    }
    multipleAndRemainder = sortBy(multipleAndRemainder, ([m]) => -m);

    // TODO: Bases, mods
    const bases = [];
    const mods = [];
    // remove coprimes
    while (multipleAndRemainder.length > 0) {
      const [base, mod] = multipleAndRemainder.shift();
      bases.push(base);
      mods.push(mod);
      multipleAndRemainder = multipleAndRemainder.filter(
        ([m]) => gcd(m, base) === 1,
      );
    }

    // crt
    let product = 1n;
    for (const base of bases) {
      product *= BigInt(base);
    }
    const inverses = bases.map((base) =>
      Math.floor(Number(product / BigInt(base))),
    );

    const modifiedGcd = (a: number, b: number) => {
      let initialB = b;
      let [x0, x1] = [0, 1];
      if (b === 1) return 1;
      while (a > 1) {
        let [div, mod] = [Math.floor(a / b), a % b];
        [a, b] = [b, mod];
        [x0, x1] = [x1 - div * x0, x0];
      }
      if (x1 >= 0) return x1;
      return x1 + initialB;
    };

    const multiples = zip(bases, inverses).map(([base, inverse]) => {
      return inverse * modifiedGcd(inverse, base);
    });
    let ret = 0n;
    for (const [mul, mod] of zip(multiples, mods)) {
      ret += BigInt(mul) * BigInt(mod);
    }
    const rem = ret % product;
    console.log(rem);
    const positiveInt = (n: number) => n === Math.floor(n) && n > 0;
    return zip(sumsOfPos, sumsOfDx).every(([pos, dx]) => {
      return positiveInt((Number(rem) - pos) / (dx - answer));
    })
      ? rem
      : 0;
  });
  console.log(res.find((v) => v));
  if (!isTest) {
    process.exit(0);
  }
  return Number(res.find((v) => v));
}

solve({ part1, test1: 2, part2, test2: 47, parser });
