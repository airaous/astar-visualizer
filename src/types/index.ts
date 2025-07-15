export type NodeType = 'start' | 'end' | 'wall' | 'visited' | 'path' | 'empty';

export interface GridNode {
  row: number;
  col: number;
  type: NodeType;
  g: number; // Distance from start
  h: number; // Heuristic (distance to end)
  f: number; // g + h
  parent: GridNode | null;
  isVisited: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface GridDimensions {
  rows: number;
  cols: number;
}
