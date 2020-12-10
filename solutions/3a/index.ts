import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Day3A implements ISolution {
  async GetSolution(inputFile: string): Promise<string> {
    const data = {};
    let lineNumber = 0;
    let lineWidth: number;
    await processFile(inputFile, line => {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '#') {
          data[`${lineNumber}.${i}`] = true;
        }
      }
      lineNumber++;
      lineWidth = line.length;
    });
    const lineCount = lineNumber; // lineNumber ends up one higher than the index of the last line, which makes it accurate for line count
    let currCol = 0;
    let treeCount = 0;
    for (let currLine = 0; currLine < lineCount; currLine++) {
      if (data[`${currLine}.${currCol}`]) {
        treeCount++;
      }
      currCol = (currCol + 3) % lineWidth;
    }

    return treeCount.toString();
  }
}
