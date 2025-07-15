import React, { useState } from 'react';

interface AlgorithmComparisonProps {
  onRunComparison: () => void;
  isRunning: boolean;
}

const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({
  onRunComparison,
  isRunning,
}) => {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Algorithm Analysis</h3>
      
      <button
        onClick={() => setShowComparison(!showComparison)}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 mb-4"
      >
        {showComparison ? 'Hide' : 'Show'} Algorithm Comparison
      </button>

      {showComparison && (
        <div className="space-y-4">
          <button
            onClick={onRunComparison}
            disabled={isRunning}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:bg-gray-400"
          >
            Run All Algorithms
          </button>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Algorithm</th>
                  <th className="text-left py-2">Time Complexity</th>
                  <th className="text-left py-2">Space Complexity</th>
                  <th className="text-left py-2">Optimal</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b">
                  <td className="py-2 font-medium">A*</td>
                  <td className="py-2">O(b^d)</td>
                  <td className="py-2">O(b^d)</td>
                  <td className="py-2">✅ Yes</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Dijkstra</td>
                  <td className="py-2">O(V²)</td>
                  <td className="py-2">O(V)</td>
                  <td className="py-2">✅ Yes</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">BFS</td>
                  <td className="py-2">O(V + E)</td>
                  <td className="py-2">O(V)</td>
                  <td className="py-2">✅ Yes (unweighted)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Greedy</td>
                  <td className="py-2">O(b^m)</td>
                  <td className="py-2">O(b^m)</td>
                  <td className="py-2">❌ No</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-xs text-gray-500">
            <p><strong>b</strong> = branching factor, <strong>d</strong> = depth of solution</p>
            <p><strong>V</strong> = vertices, <strong>E</strong> = edges, <strong>m</strong> = maximum depth</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmComparison;
