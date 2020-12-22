import { ISolution } from '../solution';
import { processFile } from '../utils/file-reader';

class Node {
  value: string;
  children: { count: number; node: Node }[] = [];
  parents: Node[] = [];

  constructor(value: string) {
    this.value = value;
  }
  addChild = (node: Node, count: number) => this.children.push({ count, node });
  addParent = (node: Node) => this.parents.push(node);
}

export default class Solution implements ISolution {
  private lineParser = /^(.+) bags contain (.+)\.$/;
  private childParser = /^(\d+) (.+) bags?$/;

  async GetSolutionA(inputFile: string): Promise<string> {
    const nodeLookup: { [value: string]: Node } = {};
    await processFile(inputFile, line => {
      this.ParseLine(line, nodeLookup);
    });

    const targetNode = nodeLookup['shiny gold'];

    const nodesToTraverse = [targetNode];
    const parents = { [targetNode.value]: targetNode };
    let currNode: Node;
    while (nodesToTraverse.length) {
      currNode = nodesToTraverse.shift();
      for (const parent of currNode.parents) {
        if (!parents[parent.value]) {
          parents[parent.value] = parent;
          nodesToTraverse.push(parent);
        }
      }
    }
    return (Object.keys(parents).length - 1).toString();
  }

  async GetSolutionB(inputFile: string): Promise<string> {
    const nodeLookup: { [value: string]: Node } = {};
    await processFile(inputFile, line => {
      this.ParseLine(line, nodeLookup);
    });

    const targetNode = nodeLookup['shiny gold'];
    const count = this.GetBagCount(targetNode);
    return count.toString();
  }

  GetBagCount(bag: Node): number {
    let count = 0;
    for (const child of bag.children) {
      count += child.count;
      count += this.GetBagCount(child.node) * child.count;
    }
    return count;
  }

  ParseLine(line: string, lookup: { [key: string]: Node }): void {
    const matches = this.lineParser.exec(line);

    if (!matches || matches.length < 3) {
      throw new Error(`LineParser regex didn't behave as expected. ${line}`);
    }
    if (!lookup[matches[1]]) {
      lookup[matches[1]] = new Node(matches[1]);
    }
    const node = lookup[matches[1]];
    if (matches[2] === 'no other bags') {
      return;
    }
    const children = matches[2].split(', ');
    for (const child of children) {
      const childMatches = this.childParser.exec(child);
      if (!childMatches || childMatches.length < 3) {
        throw new Error(`childParser regex didn't behave as expected. ${child}`);
      }
      if (!lookup[childMatches[2]]) {
        lookup[childMatches[2]] = new Node(childMatches[2]);
      }
      node.addChild(lookup[childMatches[2]], +childMatches[1]);
      lookup[childMatches[2]].addParent(node);
    }
  }
}
