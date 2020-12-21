export interface ISolution {
  GetSolutionA(inputFile: string): Promise<string>;
  GetSolutionB(inputFile: string): Promise<string>;
}
