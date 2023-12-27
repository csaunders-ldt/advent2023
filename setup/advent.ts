import { readdirSync } from 'fs';
import { sortBy } from 'lodash';
import { join } from 'path';

const days = readdirSync(join(__dirname, '..')).filter((f) =>
  f.startsWith('day'),
);
const sortedDays = sortBy(days, (d) => parseInt(d.slice(3)));
const day = process.argv[2] ? `day${process.argv[2]}` : sortedDays.at(-1);
require(`../${day}/solve`);
