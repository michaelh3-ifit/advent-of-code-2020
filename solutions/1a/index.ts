import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Day1A implements ISolution {
  public async GetSolution(inputFile: string): Promise<string> {
    const data: string[] = [];

    await processFile(inputFile, line => {
      data.push(line);
    });

    const values = {};

    for (const line of data) {
      const num = Number(line);
      if (values[2020 - num]) {
        return (num * (2020 - num)).toString();
      }

      values[num] = 1;
    }
  }
}
