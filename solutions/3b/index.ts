import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Day3B implements ISolution {
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

    const patterns: { x: number; y: number }[] = [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 5, y: 1 },
      { x: 7, y: 1 },
      { x: 1, y: 2 }
    ];
    const lineCount = lineNumber; // lineNumber ends up one higher than the index of the last line, which makes it accurate for line count

    let result = 1;

    patterns.forEach(pattern => {
      let currCol = 0;
      let currLine = 0;
      let treeCount = 0;
      while (currLine < lineCount) {
        if (data[`${currLine}.${currCol}`]) {
          treeCount++;
        }
        currCol = (currCol + pattern.x) % lineWidth;
        currLine += pattern.y;
      }

      result *= treeCount;
    });
    return result.toString();
  }
}
