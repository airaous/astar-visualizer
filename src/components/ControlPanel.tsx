import React from 'react';

interface ControlPanelProps {
  onVisualize: () => void;
  onReset: () => void;
  onClearPath: () => void;
  isRunning: boolean;
  algorithm: 'astar' | 'dijkstra' | 'bfs' | 'greedy';
  setAlgorithm: (algorithm: 'astar' | 'dijkstra' | 'bfs' | 'greedy') => void;
  speed: number;
  setSpeed: (speed: number) => void;
  gridSize: { rows: number; cols: number };
  setGridSize: (size: { rows: number; cols: number }) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onVisualize,
  onReset,
  onClearPath,
  isRunning,
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  gridSize,
  setGridSize,
}) => {
  const speedOptions = [
    { value: 50, label: 'Slow' },
    { value: 10, label: 'Normal' },
    { value: 1, label: 'Fast' },
  ];

  const gridSizeOptions = [
    { rows: 20, cols: 40, label: 'Small' },
    { rows: 25, cols: 50, label: 'Medium' },
    { rows: 30, cols: 60, label: 'Large' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="space-y-4">
        {/* Main Controls */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onVisualize}
            disabled={isRunning}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
            }`}
          >
            {isRunning ? 'Running...' : `Visualize ${algorithm.toUpperCase()}`}
          </button>
          
          <button
            onClick={onClearPath}
            disabled={isRunning}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:bg-gray-400"
          >
            Clear Path
          </button>
          
          <button
            onClick={onReset}
            disabled={isRunning}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:bg-gray-400"
          >
            Reset Grid
          </button>
        </div>

        {/* Algorithm Selection */}
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">Algorithm:</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setAlgorithm('astar')}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                algorithm === 'astar'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } disabled:opacity-50`}
            >
              A*
            </button>
            <button
              onClick={() => setAlgorithm('dijkstra')}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                algorithm === 'dijkstra'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } disabled:opacity-50`}
            >
              Dijkstra
            </button>
            <button
              onClick={() => setAlgorithm('bfs')}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                algorithm === 'bfs'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } disabled:opacity-50`}
            >
              BFS
            </button>
            <button
              onClick={() => setAlgorithm('greedy')}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                algorithm === 'greedy'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } disabled:opacity-50`}
            >
              Greedy Best-First
            </button>
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">Speed:</span>
          <div className="flex gap-2">
            {speedOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSpeed(option.value)}
                disabled={isRunning}
                className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                  speed === option.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } disabled:opacity-50`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Size Control */}
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">Grid Size:</span>
          <div className="flex gap-2">
            {gridSizeOptions.map((option) => (
              <button
                key={`${option.rows}x${option.cols}`}
                onClick={() => setGridSize(option)}
                disabled={isRunning}
                className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                  gridSize.rows === option.rows && gridSize.cols === option.cols
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } disabled:opacity-50`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
