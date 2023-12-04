type MapFn<T> = (x: string, index: number, array: string[]) => T;
type LineParserOptions<T> = {
  separator?: string;
  mapFn?: MapFn<T>;
};
type GridParserOptions<T> = {
  separator?: string;
  rowSeparator?: string;
  mapFn?: MapFn<T>;
};

export function parseLines<T = string>(
  opts?: LineParserOptions<T>,
): (input: string) => T[] {
  const { separator = '\n', mapFn = (x) => x as unknown as T } = opts ?? {};
  return (input) => input.split(separator).map(mapFn);
}

export function getGridParser<T = string>(opts?: GridParserOptions<T>) {
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
