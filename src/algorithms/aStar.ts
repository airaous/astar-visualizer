import { GridNode, Position } from '../types';
import { manhattanDistance, getNeighbors, reconstructPath } from '../utils/gridUtils';

/**
 * Priority Queue implementation for A* algorithm
 */
class PriorityQueue {
  private items: GridNode[] = [];

  enqueue(node: GridNode): void {
    this.items.push(node);
    this.items.sort((a, b) => a.f - b.f);
  }

  dequeue(): GridNode | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  contains(node: GridNode): boolean {
    return this.items.some(item => item.row === node.row && item.col === node.col);
  }

  remove(node: GridNode): void {
    this.items = this.items.filter(item => !(item.row === node.row && item.col === node.col));
  }
}

/**
 * A* Pathfinding Algorithm Implementation
 */
export const aStarAlgorithm = async (
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
      node.h = manhattanDistance({ row, col }, endPos);
      node.f = Infinity;
      node.parent = null;
      node.isVisited = false;
    }
  }

  const startNode = grid[startPos.row][startPos.col];
  const endNode = grid[endPos.row][endPos.col];

  // Initialize start node
  startNode.g = 0;
  startNode.f = startNode.h;

  const openSet = new PriorityQueue();
  openSet.enqueue(startNode);

  while (!openSet.isEmpty()) {
    const currentNode = openSet.dequeue()!;

    // If we reached the end node
    if (currentNode.row === endPos.row && currentNode.col === endPos.col) {
      const path = reconstructPath(currentNode);
      return {
        path: path.slice(1, -1), // Exclude start and end nodes from path
        visitedNodes,
        success: true,
      };
    }

    currentNode.isVisited = true;
    
    // Only add to visited nodes if it's not start or end
    if (currentNode !== startNode && currentNode !== endNode) {
      visitedNodes.push(currentNode);
      
      // Call the callback for animation
      if (onVisitNode) {
        onVisitNode(currentNode);
        // Add delay for animation
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
      }
    }

    // Check all neighbors
    const neighbors = getNeighbors(currentNode, grid, rows, cols);
    
    for (const neighbor of neighbors) {
      if (neighbor.isVisited) continue;

      const tentativeG = currentNode.g + 1; // Each step costs 1

      if (tentativeG < neighbor.g) {
        neighbor.parent = currentNode;
        neighbor.g = tentativeG;
        neighbor.f = neighbor.g + neighbor.h;

        if (!openSet.contains(neighbor)) {
          openSet.enqueue(neighbor);
        }
      }
    }
  }

  // No path found
  return {
    path: [],
    visitedNodes,
    success: false,
  };
};

/**
 * Dijkstra's Algorithm Implementation (bonus feature)
 */
export const dijkstraAlgorithm = async (
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
      node.h = 0; // Dijkstra doesn't use heuristic
      node.f = Infinity;
      node.parent = null;
      node.isVisited = false;
    }
  }

  const startNode = grid[startPos.row][startPos.col];
  const endNode = grid[endPos.row][endPos.col];

  startNode.g = 0;
  startNode.f = 0;

  const unvisitedNodes: GridNode[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].type !== 'wall') {
        unvisitedNodes.push(grid[row][col]);
      }
    }
  }

  while (unvisitedNodes.length > 0) {
    // Sort by distance (g value)
    unvisitedNodes.sort((a, b) => a.g - b.g);
    const currentNode = unvisitedNodes.shift()!;

    // If we hit a wall of infinity, we're trapped
    if (currentNode.g === Infinity) break;

    currentNode.isVisited = true;

    // If we reached the end node
    if (currentNode.row === endPos.row && currentNode.col === endPos.col) {
      const path = reconstructPath(currentNode);
      return {
        path: path.slice(1, -1), // Exclude start and end nodes from path
        visitedNodes,
        success: true,
      };
    }

    // Only add to visited nodes if it's not start or end
    if (currentNode !== startNode && currentNode !== endNode) {
      visitedNodes.push(currentNode);
      
      if (onVisitNode) {
        onVisitNode(currentNode);
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
      }
    }

    // Update neighbors
    const neighbors = getNeighbors(currentNode, grid, rows, cols);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        const newDistance = currentNode.g + 1;
        if (newDistance < neighbor.g) {
          neighbor.g = newDistance;
          neighbor.f = newDistance;
          neighbor.parent = currentNode;
        }
      }
    }
  }

  return {
    path: [],
    visitedNodes,
    success: false,
  };
};
