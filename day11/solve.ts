import { forEach, map, reduce, reverse, sortBy, split, times } from 'lodash';
import { solve } from '../utils/typescript';

type Monkey = {
  items: number[];
  op: string;
  mod: number;
  targets: [number, number];
  inspectCount: number;
};

function parser(input: string): Monkey[] {
  return map(split(input, '\n\n'), (l) => {
    const [, itemLine, opLine, modLine, t1, t2] = split(l, '\n');
    return {
      items: map([...itemLine.matchAll(/\d+/g)], Number),
      op: opLine.split(': ')[1].replace('new', 'newVal'),
      mod: +modLine.match(/\d+/)[0],
      targets: [+t1.match(/\d+/)[0], +t2.match(/\d+/)[0]],
      inspectCount: 0,
    };
  });
}

type Args = {
  monkeys: Monkey[];
  afterEval: (val: number) => number;
};

function simulateStuffSlingingSimianShenanigans({ monkeys, afterEval }: Args) {
  let newVal = 0;
  forEach(monkeys, (monkey) => {
    while (monkey.items.length) {
      const old = monkey.items.pop();
      eval(monkey.op);
      newVal = afterEval(newVal);
      const targetMonkey = newVal % monkey.mod === 0 ? 0 : 1;
      monkeys[monkey.targets[targetMonkey]].items.push(newVal);
      monkey.inspectCount++;
    }
  });
}

function part1(monkeys: Monkey[]) {
  const args = { monkeys, afterEval: (val: number) => val / 3 };
  times(20, () => simulateStuffSlingingSimianShenanigans(args));
  const sortedMonkeys = reverse(sortBy(map(monkeys, 'inspectCount')));
  return sortedMonkeys[0] * sortedMonkeys[1];
}

function part2(monkeys: Monkey[]) {
  const cap = reduce(monkeys, (max, { mod }) => max * mod, 1);
  const args = { monkeys, afterEval: (val: number) => val % cap };
  times(10000, () => simulateStuffSlingingSimianShenanigans(args));
  const sortedMonkeys = reverse(sortBy(map(monkeys, 'inspectCount')));
  return sortedMonkeys[0] * sortedMonkeys[1];
}

solve({ part1, test1: 10605, part2, test2: 2713310158, parser });
