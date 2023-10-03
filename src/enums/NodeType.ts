export enum NodeType {
  UNSPOILED = "unspoiled",
  LEGENDARY = "legendary",
}

export function nodeTypeFromString(str: string): NodeType | null {
  switch (str.toLowerCase()) {
    case "unspoiled":
      return NodeType.UNSPOILED;
    case "legendary":
      return NodeType.LEGENDARY;
    default:
      return null;
  }
}