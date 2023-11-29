import {
  filter,
  flatMap,
  fromPairs,
  keys,
  map,
  mapValues,
  max,
  partial,
  reduce,
  split,
  sum,
} from 'lodash';
import { solve } from '../utils/typescript';

const types = ['geode', 'obsidean', 'clay', 'ore'] as const;
type Resource = typeof types[number];
type Resources = { [type in Resource]: number };
type Blueprint = { [type in Resource]: Resources };

function parser(input: string) {
  return map(split(input, '\n'), (line) => {
    const costs = map(line.match(/\d+/g), Number);
    const [, ore, clayOre, obsOre, obsClay, geoOre, geoObs] = costs;
    return {
      ore: { ore },
      clay: { ore: clayOre },
      obsidean: { ore: obsOre, clay: obsClay },
      geode: { ore: geoOre, obsidean: geoObs },
    };
  });
}

type State = {
  resources: Resources;
  robots: Resources;
  timeLeft: number;
  blueprint: Blueprint;
  maxCost: Resources;
};

function timeToEarn(state: State, type: Resource, count: number) {
  if (state.resources[type] >= count) return 0;
  if (state.robots[type] === 0) return 99999;
  return Math.ceil((count - state.resources[type]) / state.robots[type]);
}

function timeToBuildRobot(state: State, robot: keyof Resources) {
  const cost = state.blueprint[robot];
  const times = map(keys(cost), (r: Resource) => timeToEarn(state, r, cost[r]));
  return max(times) + 1;
}

function canStart(state: State, type: keyof Resources) {
  const { robots, maxCost, timeLeft } = state;
  if (robots[type] >= maxCost[type] && type !== 'geode') return false;
  return timeToBuildRobot(state, type) < timeLeft;
}

function afterBuilding(state: State, type: keyof Resources) {
  const buildTime = timeToBuildRobot(state, type);
  const robots = { ...state.robots, [type]: state.robots[type] + 1 };

  const resources = mapValues(state.resources, (count, resource) => {
    const earned = buildTime * state.robots[resource];
    return count + earned - (state.blueprint[type][resource] || 0);
  });
  return { ...state, resources, robots, timeLeft: state.timeLeft - buildTime };
}

function getOptions(state: State): Resource[] {
  if (canStart({ ...state, timeLeft: 1 }, 'geode')) return ['geode'];
  return filter(types, partial(canStart, state));
}

function next(state: State): State[] {
  return map(getOptions(state), partial(afterBuilding, state));
}

function score({ robots, timeLeft, resources }: State): number {
  return robots.geode * timeLeft + resources.geode;
}

function potential(state: State): number {
  return score(state) + ((state.timeLeft + 1) * state.timeLeft) / 2;
}

function search(opts: State[], maxScore = 0): number {
  while (opts.length) {
    opts = filter(flatMap(opts, next), (s) => potential(s) > maxScore);
    maxScore = max([...map(opts, score), maxScore]);
  }
  return maxScore;
}

function quality(blueprint: Blueprint, timeLeft = 24) {
  const resources = fromPairs(map(types, (type) => [type, 0])) as Resources;
  const robots = { ...resources, ore: 1 };
  const maxCost = mapValues(resources, (_, type) =>
    max(map(types, (t2) => blueprint[t2][type])),
  );
  return search([{ blueprint, resources, robots, timeLeft, maxCost }]);
}

function part1(blueprints: Blueprint[]) {
  return sum(map(blueprints, (b, i) => quality(b) * (i + 1)));
}

function product(vals: number[]) {
  return reduce(vals, (p, v) => p * v, 1);
}

function part2(blueprints: Blueprint[]) {
  return product(map(blueprints, (b) => quality(b, 32)));
}

solve({ part1, test1: 33, part2, test2: 56 * 62, parser });
