import * as chalk from 'chalk';
import * as commander from 'commander';
import { ISolution } from './solutions/solution'
import * as path from 'path';

commander
  .command('execute <dayandpart>')
  .option('-s, --sample-data', null, false)
  .description('Executes the solution logic for a given day and part (ie 1a or 5b)')
  .action(async (dayandpart, cmdObj) => {
    try {
      await execute(dayandpart, cmdObj["sampleData"]);
    } catch (e) {
      console.log(e.message);
    }
  });

commander.parse(process.argv);

async function execute(dayandpart, useSampleData) {
  dayandpart = dayandpart.replace(/'/g,"");
  const day = dayandpart.substr(0,dayandpart.length - 1);
  const part = dayandpart.substr(dayandpart.length - 1).toUpperCase();
  const solutionPath = `./solutions/${day}/index`;
  const inputFile = path.join(__dirname, `solutions/${day}`, useSampleData ? 'sample-input.txt': 'input.txt');

  console.log(`Loading ${dayandpart} from ${solutionPath}...`);

  let solution: ISolution;
  try {
    const Solution = await import(solutionPath);
    solution = new Solution.default() as ISolution;
  } catch (e) {
    throw Error(`Error trying to load ${dayandpart}. ${e.message}`);
  }

  console.log(`Running ${dayandpart}...`);

  const start = +new Date();
  const results = await solution["GetSolution" + part](inputFile);
  const timeElapsed = +new Date() - start;
  console.log(`Result: ${chalk.bgHex('#0000AA').whiteBright(results)} (${timeElapsed} ms)`);
}