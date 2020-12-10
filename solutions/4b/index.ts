import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Day4B implements ISolution {
  async GetSolution(inputFile: string): Promise<string> {
    let count = 0;

    let currentData = [];
    await processFile(inputFile, line => {
      if (!line) {
        if (this.ValidatePassportData(currentData)) {
          count++;
        }
        currentData = [];
      }
      currentData.push(line);
    });

    // Gotta process the last passport since there isn't a blank line after
    // the data to trigger ValidatePassportData being called
    if (this.ValidatePassportData(currentData)) {
      count++;
    }

    return count.toString();
  }

  private ValidatePassportData(data: string[]): boolean {
    const requiredFields = [
      {
        field: 'byr',
        rule: (input: string) => {
          return +input >= 1920 && +input <= 2002 && input.length === 4;
        }
      },
      {
        field: 'iyr',
        rule: (input: string) => {
          return +input >= 2010 && +input <= 2020 && input.length === 4;
        }
      },
      {
        field: 'eyr',
        rule: (input: string) => {
          return +input >= 2020 && +input <= 2030 && input.length === 4;
        }
      },
      {
        field: 'hgt',
        rule: (input: string) => {
          const num = +input.substring(0, input.length - 2);
          const unit = input.substring(input.length - 2);
          if (unit === 'cm') {
            return num >= 150 && num <= 193;
          }
          if (unit === 'in') {
            return num >= 59 && num <= 76;
          }
          return false;
        }
      },
      {
        field: 'hcl',
        rule: (input: string) => {
          return /^#[0-9a-f]{6}$/.test(input);
        }
      },
      {
        field: 'ecl',
        rule: (input: string) => {
          return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(input);
        }
      },
      {
        field: 'pid',
        rule: (input: string) => {
          return /^[0-9]{9}$/.test(input);
        }
      }
    ];
    const parsedData = {};
    data.forEach(row => {
      row.split(' ').forEach(item => {
        const parsedItem = item.split(':');
        parsedData[parsedItem[0]] = parsedItem[1];
      });
    });
    return requiredFields.every(f => parsedData[f.field] && f.rule(parsedData[f.field]));
  }
}
