import { chunk, map, max, min, reduce, sortBy } from 'lodash';
import { solve } from '../utils/typescript';

type Map = [dest: number, src: number, length: number];
type Input = { seeds: number[]; maps: Map[][] };

function getNumbers(line: string) {
  return line.match(/\d+/g)?.map(Number) ?? [];
}

function parser(input: string) {
  const [seedList, ...mapLines] = input.split(/\n\n.*\n/);
  const seeds = getNumbers(seedList);
  const maps = mapLines.map((l) => l.split('\n').map(getNumbers));
  return { seeds, maps } as Input;
}

function applyMap(seed: number, maps: Map[]): number {
  const map = maps.find(([, src, len]) => seed >= src && seed < src + len);
  if (!map) return seed;
  return seed + map[0] - map[1];
}

function part1({ seeds, maps }: Input) {
  return min(map(seeds, (seed) => reduce(maps, applyMap, seed)));
}

function getCandidates(ranges: [number, number][], maps: Map[]) {
  const candidates = ranges.map(([start, end]) => {
    const overlaps = maps.filter(
      ([, src, len]) => start <= src + len && src <= end,
    );
    if (!overlaps.length) return [[start, end]];
    const sortedOverlaps = sortBy(overlaps, ([, src]) => src);

    return sortedOverlaps.flatMap(([dest, src, len]) => {
      const diff = dest - src;
      const res = [[max([start, src]) + diff, min([src + len, end]) + diff]];
      if (src > start) res.push([start, src - 1]);
      if (end > src + len + 11) res.push([src + len, end - 1]);

      return res;
    }) as [number, number][];
  });
  return candidates.flat(1);
}

function part2({ seeds, maps }: Input) {
  const opts = maps.reduce(
    (ranges, map) => getCandidates(ranges, map),
    chunk(seeds, 2).map(([start, len]) => [start, start + len - 1]),
  );
  return min(opts.flat(2).filter((v) => v !== 0));
}

solve({ part1, test1: 35, part2, test2: 46, parser });
