import React from 'react';
import { GridNode, NodeType } from '../types';

interface NodeProps {
  node: GridNode;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  size: number;
}

const Node: React.FC<NodeProps> = ({
  node,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  size,
}) => {
  const getNodeClassName = (type: NodeType): string => {
    const baseClasses = 'node cursor-pointer border border-gray-300';
    
    switch (type) {
      case 'start':
        return `${baseClasses} node-start`;
      case 'end':
        return `${baseClasses} node-end`;
      case 'wall':
        return `${baseClasses} node-wall`;
      case 'visited':
        return `${baseClasses} node-visited`;
      case 'path':
        return `${baseClasses} node-path`;
      default:
        return `${baseClasses} node-empty hover:bg-gray-200`;
    }
  };

  const getNodeSymbol = (type: NodeType): string => {
    switch (type) {
      case 'start':
        return '🚀';
      case 'end':
        return '🎯';
      default:
        return '';
    }
  };

  return (
    <div
      className={getNodeClassName(node.type)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onMouseDown={() => onMouseDown(node.row, node.col)}
      onMouseEnter={() => onMouseEnter(node.row, node.col)}
      onMouseUp={onMouseUp}
      title={`Row: ${node.row}, Col: ${node.col}\nG: ${node.g === Infinity ? '∞' : node.g}\nH: ${node.h}\nF: ${node.f === Infinity ? '∞' : node.f}`}
    >
      <div className="flex items-center justify-center w-full h-full text-xs font-bold">
        {getNodeSymbol(node.type)}
      </div>
    </div>
  );
};

export default Node;
