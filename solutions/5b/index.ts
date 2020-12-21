import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Solution implements ISolution {
  async GetSolution(inputFile: string): Promise<string> {
    const data: number[] = [];
    await processFile(inputFile, (line: string) => {
      data.push(this.ProcessRow(line));
    });

    data.sort((a, b) => b - a);
    const lastI = data.length - 1;
    const result =
      data.find((val: number, i: number, arr: number[]) => i !== 0 && i !== lastI && val - 1 !== arr[i + 1]) - 1;

    return result.toString();
  }

  ProcessRow(line: string): number {
    const row = this.ProcessSegment(line.substr(0, 7), 0, 128, 'F');
    const col = this.ProcessSegment(line.substr(7, 3), 0, 8, 'L');

    return row * 8 + col;
  }

  ProcessSegment(seg: string, min: number, max: number, lowerChar: string): number {
    if (seg.length === 0) {
      return min;
    }
    const diff = max - min;
    let newMin = min;
    let newMax = max;
    if (seg[0] === lowerChar) {
      newMax = newMax - diff / 2;
    } else {
      newMin = newMin + diff / 2;
    }
    return this.ProcessSegment(seg.substr(1), newMin, newMax, lowerChar);
  }
}
