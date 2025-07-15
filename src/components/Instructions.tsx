import React from 'react';

const Instructions: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Use</h3>
      <div className="space-y-2 text-sm text-gray-600">
        <p>• <strong>Click</strong> on empty cells to create walls</p>
        <p>• <strong>Click and drag</strong> the start (🚀) or end (🎯) nodes to move them</p>
        <p>• <strong>Select an algorithm</strong> and click "Visualize" to see it in action</p>
        <p>• <strong>Clear Path</strong> removes only the visited nodes and path</p>
        <p>• <strong>Reset Grid</strong> clears everything and starts fresh</p>
        <p>• <strong>Adjust speed</strong> to see the algorithm faster or slower</p>
      </div>
    </div>
  );
};

export default Instructions;
