import { mkdirSync, writeFileSync, copyFile, existsSync } from 'fs';
import { config } from 'dotenv';
import { forEach, map } from 'lodash';
import { env } from 'process';
import { aocFetch } from '../utils/typescript/fetch';
config();

const YEAR = 2023;

const solverByLanguage = {
  typescript: 'solve.ts',
  python: 'solve.py',
  ruby: 'solve.rb',
};

async function setupDir(day: number) {
  const folder = `day${day}`;
  if (!existsSync(folder)) {
    console.log(`Setting up ${folder}`);
    mkdirSync(folder);
    aocFetch(`day/${day}/input`).then((text) =>
      writeFileSync(`${folder}/part1.txt`, text),
    );
    copyFile(`_template/solutions.json`, `${folder}/solutions.json`, () => {});
  }
  const solver = solverByLanguage[env.LANGUAGE || 'typescript'];
  if (!existsSync(`${folder}/${solver}`)) {
    copyFile(`_template/${solver}`, `${folder}/${solver}`, () => {});
  }
}

// Just set up all folders every time - it takes a fraction of a second
const today = new Date();
const lastDay = today.getFullYear() === YEAR ? today.getDate() : 25;
if (process.argv[2]) {
  setupDir(parseInt(process.argv[2], 10));
} else {
  const daysToSetup = map(Array.from({ length: lastDay }), (_, i) => i + 1);
  forEach(daysToSetup, (day) => setupDir(day));
}
