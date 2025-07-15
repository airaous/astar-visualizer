import React, { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Node from './components/Node';
import ControlPanel from './components/ControlPanel';
import Legend from './components/Legend';
import Instructions from './components/Instructions';
import AlgorithmComparison from './components/AlgorithmComparison';
import PerformanceStats from './components/PerformanceStats';
import MazeGenerator from './components/MazeGenerator';
import MapIntegration from './components/MapIntegration';
import { GridNode, Position, GridDimensions } from './types';
import { createInitialGrid, resetGridPath } from './utils/gridUtils';
import { aStarAlgorithm, dijkstraAlgorithm } from './algorithms/aStar';
import { bfsAlgorithm, greedyBestFirstAlgorithm } from './algorithms/additionalAlgorithms';

interface PerformanceMetrics {
  algorithm: string;
  pathLength: number;
  nodesVisited: number;
  executionTime: number;
  memoryUsed: number;
}

const App: React.FC = () => {
  const [gridDimensions, setGridDimensions] = useState<GridDimensions>({
    rows: 25,
    cols: 50,
  });
  const [grid, setGrid] = useState<GridNode[][]>(() =>
    createInitialGrid(gridDimensions.rows, gridDimensions.cols)
  );
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [startPos, setStartPos] = useState<Position>({
    row: Math.floor(gridDimensions.rows / 2),
    col: Math.floor(gridDimensions.cols / 4),
  });
  const [endPos, setEndPos] = useState<Position>({
    row: Math.floor(gridDimensions.rows / 2),
    col: Math.floor((3 * gridDimensions.cols) / 4),
  });
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [algorithm, setAlgorithm] = useState<'astar' | 'dijkstra' | 'bfs' | 'greedy'>('astar');
  const [speed, setSpeed] = useState(10);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [showPerformanceStats, setShowPerformanceStats] = useState(false);

  // Calculate node size based on grid dimensions and screen size
  const calculateNodeSize = useCallback(() => {
    const maxWidth = Math.min(window.innerWidth * 0.8, 1200);
    const maxHeight = Math.min(window.innerHeight * 0.6, 600);
    const nodeWidth = Math.floor(maxWidth / gridDimensions.cols);
    const nodeHeight = Math.floor(maxHeight / gridDimensions.rows);
    return Math.min(nodeWidth, nodeHeight, 25);
  }, [gridDimensions]);

  const [nodeSize, setNodeSize] = useState(calculateNodeSize());

  // Update node size on window resize or grid dimension change
  useEffect(() => {
    const handleResize = () => {
      setNodeSize(calculateNodeSize());
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Calculate initial size

    return () => window.removeEventListener('resize', handleResize);
  }, [calculateNodeSize]);

  // Reset grid when dimensions change
  useEffect(() => {
    const newGrid = createInitialGrid(gridDimensions.rows, gridDimensions.cols);
    setGrid(newGrid);
    setStartPos({
      row: Math.floor(gridDimensions.rows / 2),
      col: Math.floor(gridDimensions.cols / 4),
    });
    setEndPos({
      row: Math.floor(gridDimensions.rows / 2),
      col: Math.floor((3 * gridDimensions.cols) / 4),
    });
  }, [gridDimensions]);

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;

    const node = grid[row][col];
    
    if (node.type === 'start') {
      setIsDraggingStart(true);
    } else if (node.type === 'end') {
      setIsDraggingEnd(true);
    } else {
      setIsMousePressed(true);
      toggleWall(row, col);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isRunning) return;

    if (isDraggingStart) {
      moveStartNode(row, col);
    } else if (isDraggingEnd) {
      moveEndNode(row, col);
    } else if (isMousePressed) {
      toggleWall(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  };

  const toggleWall = (row: number, col: number) => {
    const newGrid = grid.map(gridRow =>
      gridRow.map(node => {
        if (node.row === row && node.col === col && 
            node.type !== 'start' && node.type !== 'end') {
          return {
            ...node,
            type: node.type === 'wall' ? ('empty' as const) : ('wall' as const),
          };
        }
        return node;
      })
    );
    setGrid(newGrid);
  };

  const moveStartNode = (row: number, col: number) => {
    const node = grid[row][col];
    if (node.type === 'end' || node.type === 'wall') return;

    setGrid(prevGrid => {
      return prevGrid.map(gridRow =>
        gridRow.map(gridNode => {
          if (gridNode.type === 'start') {
            return { ...gridNode, type: 'empty' as const };
          }
          if (gridNode.row === row && gridNode.col === col) {
            return { ...gridNode, type: 'start' as const };
          }
          return gridNode;
        })
      );
    });
    setStartPos({ row, col });
  };

  const moveEndNode = (row: number, col: number) => {
    const node = grid[row][col];
    if (node.type === 'start' || node.type === 'wall') return;

    setGrid(prevGrid => {
      return prevGrid.map(gridRow =>
        gridRow.map(gridNode => {
          if (gridNode.type === 'end') {
            return { ...gridNode, type: 'empty' as const };
          }
          if (gridNode.row === row && gridNode.col === col) {
            return { ...gridNode, type: 'end' as const };
          }
          return gridNode;
        })
      );
    });
    setEndPos({ row, col });
  };

  const visualizeAlgorithm = async () => {
    if (isRunning) return;

    setIsRunning(true);
    const gridCopy = resetGridPath(grid);
    setGrid(gridCopy);

    const startTime = performance.now();

    const onVisitNode = (node: GridNode) => {
      setGrid(prevGrid =>
        prevGrid.map(row =>
          row.map(n =>
            n.row === node.row && n.col === node.col
              ? { ...n, type: 'visited' }
              : n
          )
        )
      );
    };

    try {
      let result;
      let algorithmName = '';
      
      if (algorithm === 'astar') {
        result = await aStarAlgorithm(gridCopy, startPos, endPos, onVisitNode, speed);
        algorithmName = 'A*';
      } else if (algorithm === 'dijkstra') {
        result = await dijkstraAlgorithm(gridCopy, startPos, endPos, onVisitNode, speed);
        algorithmName = 'Dijkstra';
      } else if (algorithm === 'bfs') {
        result = await bfsAlgorithm(gridCopy, startPos, endPos, onVisitNode, speed);
        algorithmName = 'BFS';
      } else if (algorithm === 'greedy') {
        result = await greedyBestFirstAlgorithm(gridCopy, startPos, endPos, onVisitNode, speed);
        algorithmName = 'Greedy Best-First';
      }

      const endTime = performance.now();
      const executionTime = Math.round(endTime - startTime);

      if (result && result.success && result.path.length > 0) {
        // Animate the path
        for (let i = 0; i < result.path.length; i++) {
          const pathNode = result.path[i];
          setTimeout(() => {
            setGrid(prevGrid =>
              prevGrid.map(row =>
                row.map(n =>
                  n.row === pathNode.row && n.col === pathNode.col
                    ? { ...n, type: 'path' }
                    : n
                )
              )
            );
          }, i * 50);
        }
        toast.success(`Path found! Length: ${result.path.length} nodes`);

        // Record performance metrics
        const metrics: PerformanceMetrics = {
          algorithm: algorithmName,
          pathLength: result.path.length,
          nodesVisited: result.visitedNodes.length,
          executionTime,
          memoryUsed: Math.round(((performance as any).memory?.usedJSHeapSize || 0) / 1024),
        };
        
        setPerformanceMetrics(prev => [metrics, ...prev.slice(0, 9)]);
        setShowPerformanceStats(true);
      } else {
        toast.error('No path found!');
      }
    } catch (error) {
      toast.error('An error occurred during pathfinding');
      console.error(error);
    }

    setIsRunning(false);
  };

  const handleGenerateMaze = (walls: { row: number; col: number }[]) => {
    if (isRunning) return;
    
    // Reset grid first
    const newGrid = createInitialGrid(gridDimensions.rows, gridDimensions.cols);
    
    // Add walls
    walls.forEach(({ row, col }) => {
      if (row >= 0 && row < gridDimensions.rows && col >= 0 && col < gridDimensions.cols) {
        newGrid[row][col].type = 'wall';
      }
    });
    
    setGrid(newGrid);
    toast.success('Maze generated successfully!');
  };

  const handleMapObstacles = (obstacles: Position[]) => {
    if (isRunning) return;
    
    // Reset grid first
    const newGrid = createInitialGrid(gridDimensions.rows, gridDimensions.cols);
    
    // Add obstacles as walls
    obstacles.forEach(({ row, col }) => {
      if (row >= 0 && row < gridDimensions.rows && col >= 0 && col < gridDimensions.cols) {
        newGrid[row][col].type = 'wall';
      }
    });
    
    setGrid(newGrid);
  };

  const handleMapStartPosition = (position: Position) => {
    setStartPos(position);
    // Update the grid to show the new start position
    setGrid(prevGrid => {
      return prevGrid.map(gridRow =>
        gridRow.map(gridNode => {
          if (gridNode.type === 'start') {
            return { ...gridNode, type: 'empty' as const };
          }
          if (gridNode.row === position.row && gridNode.col === position.col) {
            return { ...gridNode, type: 'start' as const };
          }
          return gridNode;
        })
      );
    });
  };

  const handleMapEndPosition = (position: Position) => {
    setEndPos(position);
    // Update the grid to show the new end position
    setGrid(prevGrid => {
      return prevGrid.map(gridRow =>
        gridRow.map(gridNode => {
          if (gridNode.type === 'end') {
            return { ...gridNode, type: 'empty' as const };
          }
          if (gridNode.row === position.row && gridNode.col === position.col) {
            return { ...gridNode, type: 'end' as const };
          }
          return gridNode;
        })
      );
    });
  };

  const handleRunAllAlgorithms = async () => {
    if (isRunning) return;
    
    const algorithms: Array<'astar' | 'dijkstra' | 'bfs' | 'greedy'> = ['astar', 'dijkstra', 'bfs', 'greedy'];
    const currentGrid = resetGridPath(grid);
    
    setIsRunning(true);
    const newMetrics: PerformanceMetrics[] = [];
    
    for (const algo of algorithms) {
      const gridCopy = JSON.parse(JSON.stringify(currentGrid)) as GridNode[][];
      const startTime = performance.now();
      
      let result;
      let algorithmName = '';
      
      if (algo === 'astar') {
        result = await aStarAlgorithm(gridCopy, startPos, endPos, undefined, 1);
        algorithmName = 'A*';
      } else if (algo === 'dijkstra') {
        result = await dijkstraAlgorithm(gridCopy, startPos, endPos, undefined, 1);
        algorithmName = 'Dijkstra';
      } else if (algo === 'bfs') {
        result = await bfsAlgorithm(gridCopy, startPos, endPos, undefined, 1);
        algorithmName = 'BFS';
      } else if (algo === 'greedy') {
        result = await greedyBestFirstAlgorithm(gridCopy, startPos, endPos, undefined, 1);
        algorithmName = 'Greedy Best-First';
      }
      
      const endTime = performance.now();
      const executionTime = Math.round(endTime - startTime);
      
      if (result) {
        newMetrics.push({
          algorithm: algorithmName,
          pathLength: result.success ? result.path.length : 0,
          nodesVisited: result.visitedNodes.length,
          executionTime,
          memoryUsed: Math.round(((performance as any).memory?.usedJSHeapSize || 0) / 1024),
        });
      }
    }
    
    setPerformanceMetrics(newMetrics);
    setShowPerformanceStats(true);
    setIsRunning(false);
    toast.success('Algorithm comparison completed!');
  };

  const resetGrid = () => {
    if (isRunning) return;
    const newGrid = createInitialGrid(gridDimensions.rows, gridDimensions.cols);
    setGrid(newGrid);
    setStartPos({
      row: Math.floor(gridDimensions.rows / 2),
      col: Math.floor(gridDimensions.cols / 4),
    });
    setEndPos({
      row: Math.floor(gridDimensions.rows / 2),
      col: Math.floor((3 * gridDimensions.cols) / 4),
    });
    toast.success('Grid reset successfully');
  };

  const clearPath = () => {
    if (isRunning) return;
    const newGrid = resetGridPath(grid);
    setGrid(newGrid);
    toast.success('Path cleared');
  };

  const handleGridSizeChange = (newSize: GridDimensions) => {
    if (isRunning) return;
    setGridDimensions(newSize);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Pathfinder AI – A* Visualizer
        </h1>
        <p className="text-gray-600">
          Visual educational tool demonstrating intelligent pathfinding algorithms
        </p>
      </div>

      {/* Control Panel */}
      <div className="max-w-7xl mx-auto mb-6">
        <ControlPanel
          onVisualize={visualizeAlgorithm}
          onReset={resetGrid}
          onClearPath={clearPath}
          isRunning={isRunning}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          speed={speed}
          setSpeed={setSpeed}
          gridSize={gridDimensions}
          setGridSize={handleGridSizeChange}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Grid Container */}
        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div
              className="grid-container mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gridDimensions.cols}, ${nodeSize}px)`,
                width: 'fit-content',
              }}
              onMouseLeave={handleMouseUp}
            >
              {grid.map((row, rowIndex) =>
                row.map((node, colIndex) => (
                  <Node
                    key={`${rowIndex}-${colIndex}`}
                    node={node}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseUp={handleMouseUp}
                    size={nodeSize}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Instructions />
          <Legend />
          <MapIntegration
            gridDimensions={gridDimensions}
            onStartPositionChange={handleMapStartPosition}
            onEndPositionChange={handleMapEndPosition}
            onObstaclesGenerate={handleMapObstacles}
            currentStartPos={startPos}
            currentEndPos={endPos}
          />
          <MazeGenerator
            onGenerateMaze={handleGenerateMaze}
            gridDimensions={gridDimensions}
            isRunning={isRunning}
          />
          <AlgorithmComparison
            onRunComparison={handleRunAllAlgorithms}
            isRunning={isRunning}
          />
          <PerformanceStats 
            metrics={performanceMetrics} 
            isVisible={showPerformanceStats}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS</p>
        <p>Drag start/end nodes • Click to create walls • Watch the algorithm explore!</p>
      </div>
    </div>
  );
};

export default App;
