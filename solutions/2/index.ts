import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: { char: string; min: number; max: number; pass: string }[] = [];

    const reg = /^(\d+)-(\d+) ([a-z]): ([a-z]+)/;

    await processFile(inputFile, line => {
      const match = reg.exec(line);
      data.push({
        min: Number(match[1]),
        max: Number(match[2]),
        char: match[3],
        pass: match[4]
      });
    });

    return data
      .filter(i => {
        let count = 0;
        for (const char of i.pass) {
          if (char === i.char) {
            count++;
            if (count > i.max) {
              return false;
            }
          }
        }
        return count >= i.min && count <= i.max;
      })
      .length.toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const data: { char: string; first: number; second: number; pass: string }[] = [];

    const reg = /^(\d+)-(\d+) ([a-z]): ([a-z]+)/;

    await processFile(inputFile, line => {
      const match = reg.exec(line);
      data.push({
        first: Number(match[1]) - 1,
        second: Number(match[2]) - 1,
        char: match[3],
        pass: match[4]
      });
    });

    // i.pass[i.first] === i.char XOR i.pass[i.second] === i.char
    return data
      .filter(i => (i.pass[i.first] === i.char ? i.pass[i.second] !== i.char : i.pass[i.second] === i.char))
      .length.toString();
  }
}
