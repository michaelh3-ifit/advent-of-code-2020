import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

type Operations = 'nop' | 'acc' | 'jmp';

class Instruction {
  operation: Operations;
  value: number;
}

class State {
  global: number;
  currentInstruction: number;
  instructions: Instruction[];
}

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const state: State = {
      global: 0,
      currentInstruction: 0,
      instructions: []
    };
    await processFile(inputFile, line => {
      state.instructions.push(this.parseLine(line));
    });

    return this.TestForLoop(state).finalValue.toString();
  }

  async GetSolutionB(inputFile: string): Promise<string> {
    const instructions: Instruction[] = [];
    await processFile(inputFile, line => instructions.push(this.parseLine(line)));

    let currInstructionChanged = 0;
    while (currInstructionChanged < instructions.length) {
      if (instructions[currInstructionChanged].operation === 'acc') {
        currInstructionChanged++;
        continue;
      }

      instructions[currInstructionChanged].operation =
        instructions[currInstructionChanged].operation === 'jmp' ? 'nop' : 'jmp';

      const result = this.TestForLoop({ global: 0, currentInstruction: 0, instructions });
      if (!result.isLoop) {
        return result.finalValue.toString();
      }

      instructions[currInstructionChanged].operation =
        instructions[currInstructionChanged].operation === 'jmp' ? 'nop' : 'jmp';
      currInstructionChanged++;
    }

    throw new Error('Correct answer not found');
  }

  TestForLoop(state: State): { isLoop: boolean; finalValue: number } {
    const visited = [];
    let currInstruction: Instruction;
    while (state.currentInstruction < state.instructions.length) {
      if (visited[state.currentInstruction]) {
        return { isLoop: true, finalValue: state.global };
      }
      visited[state.currentInstruction] = true;
      currInstruction = state.instructions[state.currentInstruction];
      switch (currInstruction.operation) {
        case 'acc':
          state.global += currInstruction.value;
          state.currentInstruction++;
          break;
        case 'jmp':
          state.currentInstruction += currInstruction.value;
          break;
        case 'nop':
          state.currentInstruction++;
          break;
        default:
          break;
      }
    }
    return { isLoop: false, finalValue: state.global };
  }

  parseLine(line: string): Instruction {
    const operation = line.substr(0, 3);
    const value = +line.substr(4);
    if (operation !== 'nop' && operation !== 'acc' && operation !== 'jmp') {
      throw new Error(`Invalid operation ${operation}`);
    }
    return {
      operation,
      value
    };
  }
}
