import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const lines: string[] = [];
    await processFile(inputFile, line => {
      lines.push(line);
    });

    const currTime = +lines[0];
    const busses: { id: number; waitTime: number }[] = [];

    lines[1].split(',').forEach(val => {
      if (val === 'x') {
        return;
      }
      const id = +val;
      const waitTime = (Math.floor(currTime / id) + 1) * id - currTime;
      busses.push({ id, waitTime });
    });

    busses.sort((a, b) => a.waitTime - b.waitTime);

    return (busses[0].id * busses[0].waitTime).toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const lines: string[] = [];
    await processFile(inputFile, line => {
      lines.push(line);
    });

    const busIds = lines[1].split(',');
    const busses = busIds
      .map((b, i) => {
        if (b === 'x') return null;
        return {
          i,
          val: +b,
          step: 1
        };
      })
      .filter(b => b !== null);
    busses.sort((a, b) => a.val - b.val);

    // let currMultiplier = 1
    // let currStep = 1
    // let targetNumber = busses[0].val * currMultiplier;

    // for (let i = 1; i < busses.length; i++) {
    //   while (!this.isWholeNumber((busses[i].i + targetNumber)/busses[i].val)) {
    //     currMultiplier+= currStep;
    //     targetNumber = busses[0].val * currMultiplier;
    //   }
    //   currStep = currMultiplier;
    // }

    return 'Dunno :(';
  }

  isWholeNumber(num: number): boolean {
    return Math.floor(num) === num;
  }
}
