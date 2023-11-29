import { mkdirSync, writeFileSync, copyFile, existsSync } from 'fs';
import { config } from 'dotenv';
import { forEach, map } from 'lodash';
import { env } from 'process';
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
    fetch(`https://adventofcode.com/2022/day/${day}/input`, {
      headers: {
        cookie: `session=${process.env.SESSION}`,
      },
    })
      .then((res) => res.text())
      .then((text) => writeFileSync(`${folder}/input.txt`, text));
    writeFileSync(`${folder}/solutions.txt`, '');
  }
  const solver = solverByLanguage[env.LANGUAGE || 'typescript'];
  if (!existsSync(`${folder}/${solver}`)) {
    copyFile(`_template/${solver}`, `${folder}/${solver}`, () => {});
  }
}

// Just set up all folders every time - it takes a fraction of a second
const today = new Date();
const lastDay = today.getFullYear() === YEAR ? today.getDate() : 25;
const daysToSetup = map(Array.from({ length: lastDay }), (_, i) => i + 1);
console.log(daysToSetup);

forEach(daysToSetup, (day) => setupDir(day));
