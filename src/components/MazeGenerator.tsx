import React, { useState } from 'react';

interface MazePattern {
  name: string;
  description: string;
  generator: (rows: number, cols: number) => { row: number; col: number }[];
}

interface MazeGeneratorProps {
  onGenerateMaze: (walls: { row: number; col: number }[]) => void;
  gridDimensions: { rows: number; cols: number };
  isRunning: boolean;
}

const MazeGenerator: React.FC<MazeGeneratorProps> = ({
  onGenerateMaze,
  gridDimensions,
  isRunning,
}) => {
  const [selectedPattern, setSelectedPattern] = useState<string>('random');

  const mazePatterns: MazePattern[] = [
    {
      name: 'random',
      description: 'Random scattered walls',
      generator: (rows, cols) => {
        const walls = [];
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            if (Math.random() < 0.3) {
              walls.push({ row, col });
            }
          }
        }
        return walls;
      },
    },
    {
      name: 'recursive',
      description: 'Recursive division maze',
      generator: (rows, cols) => {
        const walls: { row: number; col: number }[] = [];
        
        function divide(minRow: number, maxRow: number, minCol: number, maxCol: number) {
          if (maxRow - minRow < 2 || maxCol - minCol < 2) return;
          
          const horizontal = maxRow - minRow >= maxCol - minCol;
          
          if (horizontal) {
            const wallRow = minRow + 1 + Math.floor(Math.random() * (maxRow - minRow - 1));
            const passageCol = minCol + Math.floor(Math.random() * (maxCol - minCol + 1));
            
            for (let col = minCol; col <= maxCol; col++) {
              if (col !== passageCol) {
                walls.push({ row: wallRow, col });
              }
            }
            
            divide(minRow, wallRow - 1, minCol, maxCol);
            divide(wallRow + 1, maxRow, minCol, maxCol);
          } else {
            const wallCol = minCol + 1 + Math.floor(Math.random() * (maxCol - minCol - 1));
            const passageRow = minRow + Math.floor(Math.random() * (maxRow - minRow + 1));
            
            for (let row = minRow; row <= maxRow; row++) {
              if (row !== passageRow) {
                walls.push({ row, col: wallCol });
              }
            }
            
            divide(minRow, maxRow, minCol, wallCol - 1);
            divide(minRow, maxRow, wallCol + 1, maxCol);
          }
        }
        
        // Add border walls
        for (let i = 0; i < rows; i++) {
          walls.push({ row: i, col: 0 });
          walls.push({ row: i, col: cols - 1 });
        }
        for (let i = 0; i < cols; i++) {
          walls.push({ row: 0, col: i });
          walls.push({ row: rows - 1, col: i });
        }
        
        divide(1, rows - 2, 1, cols - 2);
        return walls;
      },
    },
    {
      name: 'spiral',
      description: 'Spiral pattern maze',
      generator: (rows, cols) => {
        const walls = [];
        const centerRow = Math.floor(rows / 2);
        const centerCol = Math.floor(cols / 2);
        
        for (let radius = 1; radius < Math.max(rows, cols) / 2; radius += 3) {
          for (let angle = 0; angle < 360; angle += 5) {
            const row = centerRow + Math.floor(radius * Math.sin(angle * Math.PI / 180));
            const col = centerCol + Math.floor(radius * Math.cos(angle * Math.PI / 180));
            
            if (row >= 0 && row < rows && col >= 0 && col < cols) {
              walls.push({ row, col });
            }
          }
        }
        return walls;
      },
    },
    {
      name: 'diagonal',
      description: 'Diagonal barriers',
      generator: (rows, cols) => {
        const walls = [];
        
        // Main diagonal
        for (let i = 0; i < Math.min(rows, cols); i++) {
          walls.push({ row: i, col: i });
        }
        
        // Anti-diagonal with gaps
        for (let i = 0; i < Math.min(rows, cols); i++) {
          if (i % 3 !== 1) {
            walls.push({ row: i, col: cols - 1 - i });
          }
        }
        
        // Additional diagonal lines
        for (let offset = 5; offset < Math.max(rows, cols); offset += 8) {
          for (let i = 0; i < Math.min(rows, cols - offset); i++) {
            walls.push({ row: i, col: i + offset });
          }
          for (let i = 0; i < Math.min(rows - offset, cols); i++) {
            walls.push({ row: i + offset, col: i });
          }
        }
        
        return walls;
      },
    },
  ];

  const handleGenerateMaze = () => {
    const pattern = mazePatterns.find(p => p.name === selectedPattern);
    if (pattern) {
      const walls = pattern.generator(gridDimensions.rows, gridDimensions.cols);
      onGenerateMaze(walls);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Maze Generator</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Maze Pattern:
          </label>
          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            disabled={isRunning}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
          >
            {mazePatterns.map((pattern) => (
              <option key={pattern.name} value={pattern.name}>
                {pattern.name.charAt(0).toUpperCase() + pattern.name.slice(1)} - {pattern.description}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleGenerateMaze}
          disabled={isRunning}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
        >
          Generate Maze
        </button>
        
        <div className="text-xs text-gray-500">
          <p>💡 <strong>Tip:</strong> Different maze patterns help test algorithm efficiency in various scenarios.</p>
        </div>
      </div>
    </div>
  );
};

export default MazeGenerator;
