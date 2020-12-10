import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

export default class Day4A implements ISolution {
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
    const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
    const parsedData = {};
    data.forEach(row => {
      row.split(' ').forEach(item => {
        const parsedItem = item.split(':');
        parsedData[parsedItem[0]] = parsedItem[1];
      });
    });
    return requiredFields.every(f => parsedData[f]);
  }
}
