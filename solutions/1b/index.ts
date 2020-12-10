import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Day1B implements ISolution {
  public async GetSolution(inputFile: string): Promise<string> {
    const data: string[] = [];

    await processFile(inputFile, line => {
      data.push(line);
    });

    const values = [];
    const firstCombine = {};

    for (const line of data) {
      const num = Number(line);
      if (firstCombine[2020 - num]) {
        return (firstCombine[2020 - num] * num).toString();
      }

      for (const val of values) {
        if (!firstCombine[num + val]) {
          firstCombine[num + val] = num * val;
        }
      }
      values.push(num);
    }
  }
}
