import { findIndex, forEach, map, split, sum, times, values } from 'lodash';
import { solve } from '../utils/typescript';

type Value = { value: number };
function parser(input: string) {
  return map(split(input, '\n'), (v) => ({ value: Number(v) }));
}

function mix(array: Value[], index: number) {
  const newPos = (array[index].value + index) % (array.length - 1);
  if (newPos === 0) {
    array.push(array.splice(index, 1)[0]);
  } else {
    array.splice(newPos, 0, array.splice(index, 1)[0]);
  }
}

function getResult(array: Value[]) {
  const zeroIndex = findIndex(array, ({ value }) => value === 0);
  const valueAt = (i: number) => array[(i + zeroIndex) % array.length].value;
  return sum(map([1000, 2000, 3000], valueAt));
}

function part1(input: Value[]) {
  forEach([...input], (v) => mix(input, input.indexOf(v)));
  return getResult(input);
}

const KEY = 811589153;
function part2(input: Value[]) {
  const array = map(input, (v) => ({ value: v.value * KEY }));
  const originalArray = [...array];
  times(10, () => forEach(originalArray, (v) => mix(array, array.indexOf(v))));
  return getResult(array);
}

solve({ part1, test1: 3, part2, test2: 1623178306, parser });
