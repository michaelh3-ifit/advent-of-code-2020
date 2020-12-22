import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: number[] = [];
    await processFile(inputFile, line => {
      data.push(+line);
    });

    data.push(0); // initial
    data.sort((a, b) => a - b);
    data.push(data[data.length - 1] + 3); // built-in adapter

    let littleJumps = 0;
    let bigJumps = 0;

    data.forEach((curr, i, arr) => {
      if (i === arr.length - 1) {
        return;
      }
      switch (arr[i + 1] - curr) {
        case 1:
          littleJumps++;
          break;
        case 3:
          bigJumps++;
          break;
      }
    });

    return (littleJumps * bigJumps).toString();
  }

  async GetSolutionB(inputFile: string): Promise<string> {
    const data: number[] = [];
    await processFile(inputFile, line => {
      data.push(+line);
    });

    data.push(0); // initial
    data.sort((a, b) => a - b);
    data.push(data[data.length - 1] + 3); // built-in adapter

    const result = this.countPath(data, 0);
    return result.toString();
  }

  cache: { [index: string]: number } = {};
  countPath(data: number[], index: number): number {
    if (this.cache[index]) {
      return this.cache[index];
    }
    const currNum = data[index];
    if (index === data.length - 1) {
      return 1;
    }
    let count = 0;
    for (let i = 1; i <= 3; i++) {
      if (data[index + i] <= currNum + 3) {
        count += this.countPath(data, index + i);
      }
    }
    this.cache[index] = count;
    return count;
  }
}
