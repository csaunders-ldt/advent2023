export function aocFetch(path: string) {
  return fetch(`https://adventofcode.com/2023/${path}`, {
    headers: {
      cookie: `session=${process.env.SESSION}`,
    },
  }).then((res) => res.text());
}
