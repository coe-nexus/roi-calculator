import React from 'react';
import { GraphView } from './GraphView';

const RepositoryView: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-900">
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">Knowledge Repository</h2>
          <p className="text-gray-400">Explore the connections between materials and topics</p>
        </div>
        
        <div className="flex-1">
          <GraphView />
        </div>
      </div>
    </div>
  );
};

export default RepositoryView;
