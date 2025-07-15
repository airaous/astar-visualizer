import React from 'react';

const Legend: React.FC = () => {
  const legendItems = [
    { color: 'bg-emerald-500', label: 'Start Node', icon: '🚀' },
    { color: 'bg-red-500', label: 'End Node', icon: '🎯' },
    { color: 'bg-gray-600', label: 'Wall Node', icon: '' },
    { color: 'bg-purple-500', label: 'Visited Node', icon: '' },
    { color: 'bg-yellow-500', label: 'Path Node', icon: '' },
    { color: 'bg-gray-100 border border-gray-300', label: 'Empty Node', icon: '' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Legend</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded ${item.color} flex items-center justify-center text-xs`}
            >
              {item.icon}
            </div>
            <span className="text-sm text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
