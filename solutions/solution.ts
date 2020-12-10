export interface ISolution {
  GetSolution(inputFile: string): Promise<string>;
}
