import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Day2A implements ISolution {
  async GetSolution(inputFile: string): Promise<string> {
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
}
