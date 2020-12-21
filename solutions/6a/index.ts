import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Day6A implements ISolution {
  async GetSolution(inputFile: string): Promise<string> {
    let count = 0;

    const data = [{}];
    let currI = 0;
    await processFile(inputFile, line => {
      if (!line) {
        data.push({});
        currI++;
      }
      line.split('').forEach(a => (data[currI][a] = 1));
    });

    count = data.reduce<number>((agg, curr) => Object.keys(curr).length + agg, 0);

    return count.toString();
  }
}
