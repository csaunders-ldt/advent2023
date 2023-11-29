const dayToRun = process.argv[2] ?? new Date().getDate();
import(`day${dayToRun}`);
