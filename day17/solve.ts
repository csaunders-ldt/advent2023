import { range, times } from 'lodash';
import { solve } from '../utils/typescript';

type Input = number[][];
type Coordinate = [x: number, y: number];
type State = { pos: Coordinate; dir: number; score: number };

function parser(input: string): Input {
  return input.split('\n').map((l) => l.split('').map(Number));
}

function move([x, y]: Coordinate, dir: number): Coordinate {
  return [x + ((2 - dir) % 2), y + ((dir - 1) % 2)];
}

function nextState(oldState: State, dir: number, grid: Input): State {
  const pos = move(oldState.pos, dir);
  const score = oldState.score + grid[pos[0]]?.[pos[1]] ?? 0;
  return { pos, dir, score };
}

function next(old: State, grid: Input, min: number, max: number): State[] {
  return [(old.dir + 3) % 4, (old.dir + 1) % 4].flatMap((dir) => {
    const states = [range(min).reduce((s, _) => nextState(s, dir, grid), old)];
    times(max - min, () => states.push(nextState(states.at(-1), dir, grid)));
    return states.filter(({ score }) => !isNaN(score));
  });
}

function foldIn(state: State[], newState: State) {
  const nextIndex = state.findIndex((s) => s.score > newState.score);
  state.splice(nextIndex === -1 ? state.length : nextIndex, 0, newState);
}

function hash({ pos, dir }: State) {
  return JSON.stringify(pos) + dir.toString();
}

export function dfs(set: State[], grid: Input, min = 1, max = 3) {
  const best: Record<string, number> = {};
  while (set[0].pos.some((v) => v !== grid.length - 1)) {
    const nextSet = next(set.shift(), grid, min, max);
    const bests = nextSet.filter((s) => s.score < (best[hash(s)] ?? 99999));
    bests.forEach((state) => (best[hash(state)] = state.score));
    bests.forEach((newState) => foldIn(set, newState));
  }
  return set[0].score;
}

function part1(input: Input) {
  return dfs([{ pos: [0, 0], dir: 1, score: 0 }], input);
}

function part2(input: Input) {
  return dfs([{ pos: [0, 0], dir: 1, score: 0 }], input, 4, 10);
}

solve({ part1, test1: 102, part2, test2: 94, parser });
