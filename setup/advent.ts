const dayToRun = process.argv[2] ?? new Date().getDate();
require(`../day${dayToRun}/solve`);
