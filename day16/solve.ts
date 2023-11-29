import { cloneDeep, filter, forEach, keys, max } from 'lodash';
import { solve } from '../utils/typescript';

type Valve = {
  name: string;
  flowRate: number;
  neighbours: string[];
  distanceTo: Record<string, number>;
};
type Valves = Record<string, Valve>;
type Player = { at: Valve; timeLeft: number };

function distance(from: Valve, to: string, valves: Valves): number {
  let searchSet = from.neighbours;
  let distance = 0;
  while (!searchSet.includes(to)) {
    distance++;
    searchSet = searchSet.flatMap((v) => valves[v].neighbours);
  }
  return distance + 1;
}

function findDistances(valves: Valves) {
  forEach(keys(valves), (name) => {
    forEach(keys(valves), (to) => {
      if (name === to || valves[to].flowRate === 0) return;
      valves[name].distanceTo[to] = distance(valves[name], to, valves);
    });
  });
}

function parser(input: string): Valves {
  const valveByName: Valves = input.split('\n').reduce((acc, line) => {
    const [name, ...neighbours] = [...line.match(/[A-Z]{2}/g)];
    const flowRate = +line.match(/\d+/)[0];
    return { ...acc, [name]: { flowRate, neighbours, distanceTo: {}, name } };
  }, {});
  findDistances(valveByName);
  return valveByName;
}

function getOptions(
  { at, timeLeft }: Player,
  map: Valves,
  seen?: Set<string>,
): string[] {
  let opts = filter(keys(at.distanceTo), (n) => !seen || !seen.has(n));
  let paths = filter(opts, (n) => at.distanceTo[n] + 1 <= timeLeft);
  const heuristic = (n: string) => map[n].flowRate / at.distanceTo[n];
  return paths.sort((a, b) => heuristic(b) - heuristic(a)).slice(0, 5);
}

function getPath(players: Player[], map: Valves, seen?: Set<string>): number {
  const [{ at, timeLeft }] = players;
  const nearby = getOptions({ at, timeLeft }, map, seen);
  const scores = nearby.flatMap((n) => {
    const newSeen = new Set([...(seen ?? []), n]);
    const timeAfter = timeLeft - at.distanceTo[n] - 1;
    const score = map[n].flowRate * timeAfter;
    const p2 = { at: map[n], timeLeft: timeAfter };
    return getPath([...players.slice(1), p2], map, newSeen) + score;
  });

  return max([...scores, 0]);
}

function part1(valves: Valves) {
  return getPath([{ at: valves['AA'], timeLeft: 30 }], valves);
}

function part2(valves: Valves) {
  const player = { at: valves['AA'], timeLeft: 26 };
  return getPath([player, cloneDeep(player)], valves);
}

solve({ part1, test1: 1651, part2, test2: 1707, parser });
