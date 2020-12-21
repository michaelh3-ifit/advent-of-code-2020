import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
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

  async GetSolutionB(inputFile: string): Promise<string> {
    let count = 0;

    const data = [{}];
    let currData = null;

    await processFile(inputFile, line => {
      if (!line) {
        data.push(currData);
        currData = null;
        return;
      }
      const answers = line.split('');
      if (!currData) {
        currData = { ...answers };
        return;
      }
      for (const key in currData) {
        if (!answers.includes(currData[key])) {
          delete currData[key];
        }
      }
    });

    data.push(currData); // Since there isn't a blank line at the end to push the last dataset

    count = data.reduce<number>((agg, curr) => Object.keys(curr).length + agg, 0);

    return count.toString();
  }
}
