import { filter, forEach, keys, max, maxBy, partial, values } from 'lodash';
import { solve } from '../utils/typescript';

type Valve = {
  name: string;
  flowRate: number;
  neighbours: string[];
  distanceTo: Record<string, number>;
};
type Valves = Record<string, Valve>;

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

function score(path: Valve[], time = 30) {
  if (time <= 0 || path.length === 1) return 0;
  const newTime = time - path[0].distanceTo[path[1].name] - 1;
  return newTime * path[1].flowRate + score(path.slice(1), newTime);
}

function hillClimb(path: Valve[]) {
  let best = { path: path, score: score(path) };

  for (let i = 1; i < path.length; i++) {
    for (let j = 1; j < path.length; j++) {
      if (i === j) continue;

      const newPath = [...path];
      [newPath[i], newPath[j]] = [newPath[j], newPath[i]];
      if (score(newPath) > best.score) {
        best = { path: newPath, score: score(newPath) };
      }

      const newPathTwo = [...path];
      newPathTwo.splice(i, 0, newPathTwo.splice(j, 1)[0]);
      if (score(newPathTwo) > best.score) {
        best = { path: newPathTwo, score: score(newPathTwo) };
      }
    }
  }
  return best.path;
}

function potential({ distanceTo }: Valve, { name, flowRate }: Valve) {
  return max([1, 3 - distanceTo[name]]) * flowRate;
}

function part1(valves: Valves) {
  let at = valves['AA'];
  const relevantNodes = filter(values(valves), ({ flowRate }) => flowRate > 0);
  const path = [valves['AA']];
  while (relevantNodes.length) {
    at = maxBy(relevantNodes, partial(potential, at));
    path.push(...relevantNodes.splice(relevantNodes.indexOf(at), 1));
  }
  let pathScore = score(path);
  let nextPath = hillClimb(path);
  while (score(nextPath) > pathScore) {
    pathScore = score(nextPath);
    nextPath = hillClimb(nextPath);
  }
  return pathScore;
}

function part2(valves: Valves) {
  const player = { at: valves['AA'], timeLeft: 26 };
  return 0;
}

solve({ part1, part2, test2: 1707, parser });
