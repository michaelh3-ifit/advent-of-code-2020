import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Day2B implements ISolution {
  async GetSolution(inputFile: string): Promise<string> {
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
