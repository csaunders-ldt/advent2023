export function parseLines(
  opts: { separator: string } = { separator: '\n' },
): (input: string) => string[] {
  const { separator } = opts;
  return (input) => input.split(separator);
}

type GridParserOptions<T> = {
  separator?: string;
  rowSeparator?: string;
  mapFn?: (x: string) => T;
};

export function getGridParser<T>(opts?: GridParserOptions<T>) {
  const {
    separator = '\n',
    rowSeparator = '',
    mapFn = (x) => x as unknown as T,
  } = opts || {};
  return (input: string) => {
    const rows = input.split(separator);
    return rows.map((row) => row.split(rowSeparator).map(mapFn));
  };
}

export const parseGrid = getGridParser<string>();
