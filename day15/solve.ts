import { every, find, flatten, map, range, split, uniq } from 'lodash';
import { solve } from '../utils/typescript';

type Position = [x: number, y: number];
type Sensor = { center: Position; beacon: Position; width: number };

function manhattanDistance([x, y]: Position, [x2, y2]: Position) {
  return Math.abs(x - x2) + Math.abs(y - y2);
}

function parser(input: string): Sensor[] {
  return map(split(input, '\n'), (line) => {
    const [x, y, beaconX, beaconY] = [...line.match(/-?\d+/g)].map(Number);
    const width = manhattanDistance([x, y], [beaconX, beaconY]);
    return { center: [x, y], beacon: [beaconX, beaconY], width };
  });
}

function part1(sensors: Sensor[], isTest: boolean) {
  const targetY = isTest ? 10 : 2000000;
  const overlappingBeacons = new Set<number>();
  const points = map(sensors, ({ center: [x, y], beacon, width }) => {
    if (beacon[1] === targetY) overlappingBeacons.add(beacon[0]);

    const yWidth = width - Math.abs(y - targetY);
    return yWidth < 0 ? [] : range(x - yWidth, x + yWidth + 1);
  });
  return uniq(flatten(points)).length - overlappingBeacons.size;
}

function contains([posX, posY]: Position, { center: [x, y], width }: Sensor) {
  return manhattanDistance([posX, posY], [x, y]) <= width;
}

function part2(sensors: Sensor[], isTest: boolean) {
  const limit = isTest ? 20 : 4000000;
  const withinLimit = ([x, y]: Position) =>
    x >= 0 && y >= 0 && x <= limit && y <= limit;

  for (let { center, width } of sensors) {
    const [x, y] = center;
    const points = map(range(width + 2), (i) => [
      [x + i, y - width + i - 1],
      [x + i, y + width - i + 1],
      [x - i, y - width + i - 1],
      [x - i, y + width - i + 1],
    ]) as Position[][];
    const point = find(
      flatten(points),
      (p) => every(sensors, (s) => !contains(p, s)) && withinLimit(p),
    );
    if (point) return point[0] * 4000000 + point[1];
  }
  throw new Error('No point found');
}

solve({ part1, test1: 26, part2, test2: 56000011, parser });
