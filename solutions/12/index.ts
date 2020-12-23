import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

type heading = 'N' | 'S' | 'E' | 'W';
type operation = 'L' | 'R' | 'F' | heading;
interface IInstruction {
  op: operation;
  value: number;
}

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const instructions: IInstruction[] = [];
    await processFile(inputFile, line => {
      instructions.push({ op: <operation>line.substring(0, 1), value: +line.substring(1) });
    });

    const currPos: { x: number; y: number; heading: heading } = { x: 0, y: 0, heading: 'E' };

    for (const instruction of instructions) {
      const op = instruction.op === 'F' ? currPos.heading : instruction.op; // If it's F just move in the direction heading
      const val = instruction.op === 'L' ? -instruction.value : instruction.value;
      switch (op) {
        case 'N':
          currPos.y += val;
          break;
        case 'S':
          currPos.y -= val;
          break;
        case 'E':
          currPos.x += val;
          break;
        case 'W':
          currPos.x -= val;
          break;
        case 'L':
        case 'R':
          currPos.heading = this.calculateNewHeading(currPos.heading, val);
          break;
        default:
          break;
      }
    }

    return (Math.abs(currPos.x) + Math.abs(currPos.y)).toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const instructions: IInstruction[] = [];
    await processFile(inputFile, line => {
      instructions.push({ op: <operation>line.substring(0, 1), value: +line.substring(1) });
    });

    const currPos: { x: number; y: number; heading: heading; waypointX: number; waypointY: number } = {
      x: 0,
      y: 0,
      heading: 'E',
      waypointX: 10,
      waypointY: 1
    };

    for (const instruction of instructions) {
      const val = instruction.op === 'L' ? -instruction.value : instruction.value;
      switch (instruction.op) {
        case 'N':
          currPos.waypointY += val;
          break;
        case 'S':
          currPos.waypointY -= val;
          break;
        case 'E':
          currPos.waypointX += val;
          break;
        case 'W':
          currPos.waypointX -= val;
          break;
        case 'L':
        case 'R':
          {
            const newWaypoint = this.calculateWaypointRotation({ x: currPos.waypointX, y: currPos.waypointY }, val);
            currPos.waypointX = newWaypoint.x;
            currPos.waypointY = newWaypoint.y;
          }
          break;
        case 'F':
          currPos.x = currPos.x + currPos.waypointX * val;
          currPos.y = currPos.y + currPos.waypointY * val;
          break;
        default:
          break;
      }
    }

    return (Math.abs(currPos.x) + Math.abs(currPos.y)).toString();
  }

  calculateWaypointRotation(currentWaypoint: { x: number; y: number }, rotation: number): { x: number; y: number } {
    let rot = rotation;
    const result = { x: currentWaypoint.x, y: currentWaypoint.y };
    if (rot < 0) {
      rot = 360 + rot;
    }
    switch (rot) {
      case 90:
        result.x = currentWaypoint.y;
        result.y = -currentWaypoint.x;
        break;
      case 180:
        result.x = -currentWaypoint.x;
        result.y = -currentWaypoint.y;
        break;
      case 270:
        result.x = -currentWaypoint.y;
        result.y = currentWaypoint.x;
        break;
      default:
        throw new Error(`Unexpected rotation ${rot}`);
    }

    return result;
  }

  calculateNewHeading(currentHeading: heading, rotation: number): heading {
    const dirs: heading[] = ['N', 'E', 'S', 'W'];
    const currDirIndex = dirs.indexOf(currentHeading);
    let indexChange = rotation / 90;
    if (indexChange < 0) {
      indexChange = 4 + indexChange;
    }
    return dirs[(currDirIndex + indexChange) % 4];
  }
}
