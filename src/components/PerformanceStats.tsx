import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  algorithm: string;
  pathLength: number;
  nodesVisited: number;
  executionTime: number;
  memoryUsed: number;
}

interface PerformanceStatsProps {
  metrics: PerformanceMetrics[];
  isVisible: boolean;
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({ metrics, isVisible }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimate(true);
    }
  }, [isVisible]);

  if (!isVisible || metrics.length === 0) return null;

  const bestPathLength = Math.min(...metrics.map(m => m.pathLength).filter(p => p > 0));
  const fastestTime = Math.min(...metrics.map(m => m.executionTime));
  const fewestNodes = Math.min(...metrics.map(m => m.nodesVisited));

  return (
    <div className={`bg-white p-4 rounded-lg shadow-lg transition-all duration-500 ${animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance Metrics</h3>
      
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div 
            key={metric.algorithm}
            className={`p-3 rounded border-l-4 transition-all duration-300 delay-${index * 100} ${
              animate ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            } ${
              metric.pathLength === bestPathLength && metric.pathLength > 0
                ? 'border-green-500 bg-green-50'
                : metric.executionTime === fastestTime
                ? 'border-blue-500 bg-blue-50'
                : metric.nodesVisited === fewestNodes
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-800">{metric.algorithm}</h4>
              <div className="flex gap-2">
                {metric.pathLength === bestPathLength && metric.pathLength > 0 && (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Shortest Path</span>
                )}
                {metric.executionTime === fastestTime && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Fastest</span>
                )}
                {metric.nodesVisited === fewestNodes && (
                  <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">Most Efficient</span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Path Length:</span> {metric.pathLength || 'No path'}
              </div>
              <div>
                <span className="font-medium">Nodes Visited:</span> {metric.nodesVisited}
              </div>
              <div>
                <span className="font-medium">Time:</span> {metric.executionTime}ms
              </div>
              <div>
                <span className="font-medium">Memory:</span> {metric.memoryUsed}KB
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-600">
        <p><strong>Analysis:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>A* typically finds optimal paths with fewer nodes explored than Dijkstra</li>
          <li>BFS guarantees shortest path in unweighted graphs but explores more nodes</li>
          <li>Greedy Best-First is fastest but may not find optimal path</li>
          <li>Dijkstra explores many nodes but guarantees optimal path</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceStats;
