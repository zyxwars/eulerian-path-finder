export interface Pos {
  x: number;
  y: number;
}

export interface Rect extends Pos {
  width: number;
  height: number;
}

export interface Node extends Pos {
  solutionOrder: string;
  isSelected: boolean;
  edges: Set<Node>;
}

export interface Edge extends Rect {
  angleDeg: number;
  node1: Node;
  node2: Node;
}
