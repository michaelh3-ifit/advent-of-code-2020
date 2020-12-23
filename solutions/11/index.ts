import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

type spotState = 'L' | '.' | '#';
export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: spotState[][] = [];
    await processFile(inputFile, line => {
      data.push(<spotState[]>line.split(''));
    });

    let prevData: spotState[][];
    const currData = this.cloneData(data);
    while (!this.areEqual(prevData, currData)) {
      prevData = this.cloneData(currData);

      for (let y = 0; y < prevData.length; y++) {
        for (let x = 0; x < prevData[y].length; x++) {
          const adjacentSeatsVals = this.getAdjacentSeatValues(prevData, y, x);
          switch (prevData[y][x]) {
            case 'L':
              if (adjacentSeatsVals.indexOf('#') === -1) {
                currData[y][x] = '#';
              }
              break;
            case '#':
              if (adjacentSeatsVals.filter(s => s === '#').length >= 4) {
                currData[y][x] = 'L';
              }
              break;
            case '.':
            default:
              break;
          }
        }
      }
    }

    return currData
      .reduce((total: number, curr: spotState[]) => {
        return (
          total +
          curr.reduce<number>((innerTotal: number, innerCurr: spotState) => {
            return innerTotal + (innerCurr === '#' ? 1 : 0);
          }, 0)
        );
      }, 0)
      .toString();
  }

  async GetSolutionB(inputFile: string): Promise<string> {
    const data: spotState[][] = [];
    await processFile(inputFile, line => {
      data.push(<spotState[]>line.split(''));
    });

    let prevData: spotState[][];
    const currData = this.cloneData(data);
    while (!this.areEqual(prevData, currData)) {
      prevData = this.cloneData(currData);

      for (let y = 0; y < prevData.length; y++) {
        for (let x = 0; x < prevData[y].length; x++) {
          const adjacentSeatsVals = this.getAdjacentSeatValuesInLineOfSight(prevData, y, x);
          switch (prevData[y][x]) {
            case 'L':
              if (adjacentSeatsVals.indexOf('#') === -1) {
                currData[y][x] = '#';
              }
              break;
            case '#':
              if (adjacentSeatsVals.filter(s => s === '#').length >= 5) {
                currData[y][x] = 'L';
              }
              break;
            case '.':
            default:
              break;
          }
        }
      }
    }

    return currData
      .reduce((total: number, curr: spotState[]) => {
        return (
          total +
          curr.reduce<number>((innerTotal: number, innerCurr: spotState) => {
            return innerTotal + (innerCurr === '#' ? 1 : 0);
          }, 0)
        );
      }, 0)
      .toString();
  }

  cloneData(data: spotState[][]): spotState[][] {
    return JSON.parse(JSON.stringify(data));
  }

  areEqual(a: spotState[][], b: spotState[][]): boolean {
    if (!a || !b) {
      return false;
    }
    return JSON.stringify(a) === JSON.stringify(b);
  }

  getAdjacentSeatValues(data: spotState[][], y: number, x: number): spotState[] {
    const result: spotState[] = [];
    const lowY = y === 0 ? 0 : y - 1;
    const highY = y === data.length - 1 ? y : y + 1;
    const lowX = x === 0 ? 0 : x - 1;
    const highX = x === data[0].length - 1 ? x : x + 1;
    for (let dy = lowY; dy < highY + 1; dy++) {
      for (let dx = lowX; dx < highX + 1; dx++) {
        if (dx !== x || dy !== y) {
          result.push(data[dy][dx]);
        }
      }
    }
    return result;
  }

  getAdjacentSeatValuesInLineOfSight(data: spotState[][], y: number, x: number): spotState[] {
    const directions: { dy: number; dx: number }[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx !== 0 || dy !== 0) {
          directions.push({ dy, dx });
        }
      }
    }
    const maxY = data.length - 1;
    const maxX = data[0].length - 1;
    const result: spotState[] = [];

    for (const direction of directions) {
      let currY = y + direction.dy;
      let currX = x + direction.dx;
      while (currY >= 0 && currY <= maxY && currX >= 0 && currX <= maxX) {
        if (data[currY][currX] !== '.') {
          result.push(data[currY][currX]);
          break;
        }
        currY += direction.dy;
        currX += direction.dx;
      }
    }
    return result;
  }
}
