import { GridNode, Position } from '../types';

/**
 * Calculate Manhattan distance between two positions
 */
export const manhattanDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
};

/**
 * Calculate Euclidean distance between two positions
 */
export const euclideanDistance = (pos1: Position, pos2: Position): number => {
  return Math.sqrt(
    Math.pow(pos1.row - pos2.row, 2) + Math.pow(pos1.col - pos2.col, 2)
  );
};

/**
 * Get valid neighbors of a node
 */
export const getNeighbors = (
  node: GridNode,
  grid: GridNode[][],
  rows: number,
  cols: number
): GridNode[] => {
  const neighbors: GridNode[] = [];
  const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1],  // Right
  ];

  for (const [deltaRow, deltaCol] of directions) {
    const newRow = node.row + deltaRow;
    const newCol = node.col + deltaCol;

    if (
      newRow >= 0 &&
      newRow < rows &&
      newCol >= 0 &&
      newCol < cols &&
      grid[newRow][newCol].type !== 'wall'
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }

  return neighbors;
};

/**
 * Create a new grid node
 */
export const createNode = (row: number, col: number): GridNode => ({
  row,
  col,
  type: 'empty',
  g: Infinity,
  h: 0,
  f: Infinity,
  parent: null,
  isVisited: false,
});

/**
 * Reset grid to initial state while preserving walls, start, and end
 */
export const resetGridPath = (grid: GridNode[][]): GridNode[][] => {
  return grid.map(row =>
    row.map(node => ({
      ...node,
      g: Infinity,
      h: 0,
      f: Infinity,
      parent: null,
      isVisited: false,
      type: node.type === 'visited' || node.type === 'path' ? 'empty' : node.type,
    }))
  );
};

/**
 * Create initial grid
 */
export const createInitialGrid = (rows: number, cols: number): GridNode[][] => {
  const grid: GridNode[][] = [];
  
  for (let row = 0; row < rows; row++) {
    const currentRow: GridNode[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }

  // Set default start and end positions
  const startRow = Math.floor(rows / 2);
  const startCol = Math.floor(cols / 4);
  const endRow = Math.floor(rows / 2);
  const endCol = Math.floor((3 * cols) / 4);

  grid[startRow][startCol].type = 'start';
  grid[endRow][endCol].type = 'end';

  return grid;
};

/**
 * Reconstruct path from end node to start node
 */
export const reconstructPath = (endNode: GridNode): GridNode[] => {
  const path: GridNode[] = [];
  let currentNode: GridNode | null = endNode;

  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }

  return path;
};
