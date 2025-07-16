import React from 'react';
import { Home, Library, Network, Bot } from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bot className="w-8 h-8 text-blue-600" />
          Atlas
        </h1>
        <p className="text-sm text-gray-600 mt-1">AI Teacher Platform</p>
      </div>
      
      <nav className="flex-1 p-4">
        <button
          onClick={() => setActiveTab('home')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            activeTab === 'home' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Chat</span>
        </button>
        
        <button
          onClick={() => setActiveTab('materials')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            activeTab === 'materials' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="font-medium">Materials</span>
        </button>
        
        <button
          onClick={() => setActiveTab('repository')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            activeTab === 'repository' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Network className="w-5 h-5" />
          <span className="font-medium">Repository</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
