import { readFileSync, existsSync, appendFile, writeFileSync } from 'fs';
import { config } from 'dotenv';
import { dirname } from 'path';
import caller from 'caller';
config();

type SolveArgs<T, TResult1, TResult2> = {
  part1: (input: T, isTest?: boolean) => TResult1;
  part2: (input: T, isTest?: boolean) => TResult2;
  test1?: TResult1;
  test2?: TResult2;
  parser: (input: string) => T;
};

function read(fileName: string): string {
  return readFileSync(fileName, 'utf8').replace(/\n$/, '').replace(/\r/g, '');
}

export async function solve<
  T = string[],
  TResult1 = { toString: () => string } | undefined,
  TResult2 = TResult1,
>({ part1, test1, part2, test2, parser }: SolveArgs<T, TResult1, TResult2>) {
  const dir = dirname(caller());
  const day = dir.replace(/.*day/, '');

  const part1Solved = existsSync(`${dir}/input2.txt`);
  const part = part1Solved ? 2 : 1;

  const [solver, file, solutionsFile, test, testFile] = part1Solved
    ? [part2, 'input2.txt', 'solutions2.txt', test2, 'test2.txt']
    : [part1, 'input.txt', 'solutions.txt', test1, 'test.txt'];

  if (test) {
    const testInput = parser(read(`${dir}/${testFile}`));
    const testOutput = solver(testInput, true)?.toString();
    if (testOutput !== test.toString()) {
      console.error(
        `Test failed for day ${day} part ${part}:\nExpected\n${test}\nGot\n${testOutput}\n`,
      );
      process.exit(1);
    }
    console.log(`Test passed for day ${day} part ${part}`);
  }

  const fileName = `${dir}/${file}`;
  const input = parser(read(fileName));
  const answer = solver(input, false)?.toString();
  console.log(`Attempting ${answer}`);
  const solutions = read(`${dir}/${solutionsFile}`).split('\n');
  if (solutions.includes(answer || '')) {
    console.log('Solution already attempted!');
    return;
  }
  appendFile(`${dir}/${solutionsFile}`, `${answer}\n`, () => {});
  const result = await fetch(
    `https://adventofcode.com/2022/day/${day}/answer`,
    {
      method: 'POST',
      headers: {
        cookie: `session=${process.env.SESSION}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `level=${part}&answer=${answer}`,
    },
  );
  const body = await result.text();
  if (body.includes('not the right answer')) {
    console.log(`Wrong answer\n${body}`);
  } else {
    console.log('Correct answer!');
    if (part === 2) return;

    writeFileSync(`${dir}/solutions2.txt`, '');
    fetch(`https://adventofcode.com/2022/day/${day}/input`, {
      headers: {
        cookie: `session=${process.env.SESSION}`,
      },
    })
      .then((res) => res.text())
      .then((text) => writeFileSync(`${dir}/input2.txt`, text));
  }
}
