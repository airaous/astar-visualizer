import { GridNode, Position } from '../types';
import { manhattanDistance, getNeighbors, reconstructPath } from '../utils/gridUtils';

/**
 * Breadth-First Search Algorithm Implementation
 */
export const bfsAlgorithm = async (
  grid: GridNode[][],
  startPos: Position,
  endPos: Position,
  onVisitNode?: (node: GridNode) => void,
  animationSpeed: number = 10
): Promise<{
  path: GridNode[];
  visitedNodes: GridNode[];
  success: boolean;
}> => {
  const rows = grid.length;
  const cols = grid[0].length;
  const visitedNodes: GridNode[] = [];

  // Reset all nodes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const node = grid[row][col];
      node.g = Infinity;
      node.h = 0;
      node.f = Infinity;
      node.parent = null;
      node.isVisited = false;
    }
  }

  const startNode = grid[startPos.row][startPos.col];
  const endNode = grid[endPos.row][endPos.col];

  const queue: GridNode[] = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const currentNode = queue.shift()!;

    if (currentNode.row === endPos.row && currentNode.col === endPos.col) {
      const path = reconstructPath(currentNode);
      return {
        path: path.slice(1, -1),
        visitedNodes,
        success: true,
      };
    }

    if (currentNode !== startNode && currentNode !== endNode) {
      visitedNodes.push(currentNode);
      if (onVisitNode) {
        onVisitNode(currentNode);
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
      }
    }

    const neighbors = getNeighbors(currentNode, grid, rows, cols);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.parent = currentNode;
        queue.push(neighbor);
      }
    }
  }

  return {
    path: [],
    visitedNodes,
    success: false,
  };
};

/**
 * Greedy Best-First Search Algorithm Implementation
 */
export const greedyBestFirstAlgorithm = async (
  grid: GridNode[][],
  startPos: Position,
  endPos: Position,
  onVisitNode?: (node: GridNode) => void,
  animationSpeed: number = 10
): Promise<{
  path: GridNode[];
  visitedNodes: GridNode[];
  success: boolean;
}> => {
  const rows = grid.length;
  const cols = grid[0].length;
  const visitedNodes: GridNode[] = [];

  // Reset all nodes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const node = grid[row][col];
      node.g = 0;
      node.h = manhattanDistance({ row, col }, endPos);
      node.f = node.h; // Only heuristic matters
      node.parent = null;
      node.isVisited = false;
    }
  }

  const startNode = grid[startPos.row][startPos.col];
  const openSet: GridNode[] = [startNode];

  while (openSet.length > 0) {
    // Sort by heuristic value (h)
    openSet.sort((a, b) => a.h - b.h);
    const currentNode = openSet.shift()!;

    if (currentNode.row === endPos.row && currentNode.col === endPos.col) {
      const path = reconstructPath(currentNode);
      return {
        path: path.slice(1, -1),
        visitedNodes,
        success: true,
      };
    }

    currentNode.isVisited = true;

    if (currentNode !== startNode && currentNode !== endPos) {
      visitedNodes.push(currentNode);
      if (onVisitNode) {
        onVisitNode(currentNode);
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
      }
    }

    const neighbors = getNeighbors(currentNode, grid, rows, cols);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !openSet.includes(neighbor)) {
        neighbor.parent = currentNode;
        openSet.push(neighbor);
      }
    }
  }

  return {
    path: [],
    visitedNodes,
    success: false,
  };
};
