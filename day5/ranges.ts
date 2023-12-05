import { flatten, min, range, reduce, reverse, sortBy, sum } from 'lodash';
import { solve } from '../utils/typescript';

type Map = [dest: number, src: number, length: number];
type Input = { seeds: number[]; maps: Map[][] };
type Delta = { pos: number; value: number };

function getNumbers(line: string) {
  return line.match(/\d+/g)?.map(Number) ?? [];
}

function parser(input: string) {
  const [seedList, ...mapLines] = input.split(/\n\n.*\n/);
  const seeds = getNumbers(seedList);
  const maps = mapLines.map((l) => l.split('\n').map(getNumbers));
  return { seeds, maps } as Input;
}

function resolve(seed: number, deltas: Delta[]) {
  const previousDeltas = deltas.filter(({ pos }) => pos <= seed);
  // REMOVEME
  if (sum(previousDeltas.map(({ value }) => value)) + seed < 0) {
    throw new Error(`Deltas confusing: seed: ${seed}, sum: ${sum(
      previousDeltas.map(({ value }) => value),
    )}\n
     ${JSON.stringify(deltas)}`);
  }

  return sum(previousDeltas.map(({ value }) => value));
}

function getDeltas(deltas: Delta[], [dest, src, len]: Map) {
  const diff = dest - src;

  const merges = deltas.filter(({ pos }) => pos > dest && pos < dest + len - 1);
  const toAdd = merges.map(({ pos, value }) => ({ pos: pos - diff, value }));
  const start = diff + resolve(dest, deltas) - resolve(src, deltas);
  console.log(
    `${diff} + ${resolve(dest, deltas)} - ${resolve(src, deltas)} = ${start}`,
  );
  const end = resolve(src + len, deltas) - diff - resolve(dest + len, deltas);
  console.log(
    `${resolve(src + len, deltas)} - ${diff} - ${resolve(
      dest + len,
      deltas,
    )} = ${end}`,
  );
  // console.log({ start, end });
  // console.log([
  //   { pos: src, value: start },
  //   { pos: src + len, value: end },
  //   ...toAdd,
  // ]);
  return [{ pos: src, value: start }, { pos: src + len, value: end }, ...toAdd];
}

function mergeMaps(deltas: Delta[], maps: Map[]) {
  const newDeltas = maps.map((map) => getDeltas(deltas, map));
  const oldParts = deltas.filter(
    ({ pos }) => !maps.some(([, src, len]) => pos > src && pos < src + len),
  );
  const tmp_result = sortBy([...oldParts, ...flatten(newDeltas)], 'pos');
  console.log({
    maps,
    ranges: maps.map(
      ([dest, src, len]) => `${src}-${src + len - 1} ${dest - src}`,
    ),
    deltas: deltas.map(({ pos, value }) => ({
      pos,
      value,
      sum: resolve(pos, deltas),
    })),
    oldParts: oldParts.map(({ pos, value }) => ({
      pos,
      value,
      sum: resolve(pos, deltas),
    })),
    newDeltas: JSON.stringify(newDeltas.map((d) => sortBy(d, 'pos'))),
    tmp_result,
  });
  try {
    range(0, 100).forEach((i) => resolve(i, tmp_result));
  } catch (e) {
    console.log(
      range(0, 100).forEach((i) => console.log(i, resolve(i, tmp_result))),
    );
  }
  console.log({
    res: tmp_result.map(({ pos, value }) => ({
      pos,
      value,
      sum: resolve(pos, tmp_result),
    })),
  });
  return sortBy([...oldParts, ...flatten(newDeltas)], 'pos');
}

function part1({ seeds, maps }: Input) {
  const deltas = reverse(maps).reduce(mergeMaps, []);
  // console.log(deltas);
  // console.log(seeds.map((seed) => resolve(seed, deltas) + seed));
  return min(seeds.map((seed) => resolve(seed, deltas) + seed));
}

function part2({ seeds, maps }: Input) {
  return 'part2';
}

solve({ part1, test1: 35, part2, test2: 'TODO', parser });
