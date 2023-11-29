import { filter, forEach, keys, map, min, split, sum, values } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

type Files = Record<string, number>;

function parseTree(input: string[]): Record<string, Files> {
  const directories: Record<string, Files> = { '': {} };

  let currentPath: string[] = [];
  const getPath = (file = '') => `${currentPath.join('/')}${file}`;
  for (const line of input) {
    if (line === '$ ls' || line.startsWith('dir')) continue;
    if (line === '$ cd ..') {
      currentPath.pop();
      continue;
    }
    if (line.startsWith('$ cd ')) {
      currentPath.push(line.slice(5));
      if (!directories[getPath()]) {
        directories[getPath()] = {};
      }
      continue;
    }
    const [size, name] = split(line, ' ');
    forEach(currentPath, (_, i) => {
      directories[currentPath.slice(0, i + 1).join('/')][getPath(name)] = +size;
    });
  }

  return directories;
}

function getFolderSize(folder: Files) {
  return sum(values(folder));
}

function part1(commands: string[]) {
  const folders = values(parseTree(commands));
  const totals = map(folders, getFolderSize);
  return sum(filter(totals, (total) => total < 100000));
}

function part2(commands: string[]) {
  const tree = parseTree(commands);
  const freeSpace = 70000000 - getFolderSize(tree['/']);
  const totals = map(values(tree), getFolderSize);
  return min(filter(totals, (total) => total + freeSpace > 30000000))!;
}

solve({ part1, test1: 95437, part2, test2: 24933642, parser: parseLines() });
