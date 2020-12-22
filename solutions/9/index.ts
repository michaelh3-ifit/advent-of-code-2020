import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: number[] = [];
    await processFile(inputFile, line => {
      data.push(+line);
    });

    return this.GetInvalidNumber(data).toString();
  }

  GetInvalidNumber(data: number[]): number {
    const preamble = 25;
    const lookup = data.slice(0, preamble);
    for (let i = preamble; i < data.length; i++) {
      const targetNumber = data[i];
      let found = false;
      for (let j = 0; j < lookup.length; j++) {
        for (let k = j; k < lookup.length; k++) {
          // j !== k makes sure we aren't trying to add the number to itself
          if (j !== k && lookup[j] + lookup[k] === targetNumber) {
            found = true;
            j = k = lookup.length; // break x 2;
          }
        }
      }
      if (!found) {
        return targetNumber;
      }
      lookup.shift();
      lookup.push(targetNumber);
    }

    throw new Error('no solution found');
  }

  async GetSolutionB(inputFile: string): Promise<string> {
    const data: number[] = [];
    await processFile(inputFile, line => {
      data.push(+line);
    });

    const targetNumber = this.GetInvalidNumber(data);

    let currentValue = data[0];
    let low = 0;
    let high = 0;

    while (currentValue !== targetNumber && high < data.length) {
      if (currentValue < targetNumber) {
        high++;
        currentValue += data[high];
      } else {
        currentValue -= data[low];
        low++;
      }
    }
    const range = data.slice(low, high + 1);
    range.sort((a, b) => a - b);
    return (range[0] + range[range.length - 1]).toString();
  }
}
