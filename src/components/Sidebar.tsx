import React from 'react';
import { Home, Library, Network, LogIn, LogOut, Settings } from 'lucide-react';
import { TabType } from '../types';
import { config } from '../config';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}



const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) => {
  const { user, logout, hasPermission } = useAuth();

  return (
    <div
      className={`w-64 bg-white border-r border-gray-200 flex flex-col transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative h-full z-10`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {config.tenant?.title}
          </h1>
          <p className="text-sm text-gray-600 mt-1">{config.tenant?.description}</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
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
      <div className="p-4 mt-auto border-t border-gray-200">
        {user ? (
          <>
            {hasPermission('update', 'tenant') && (
              <Link
                to="/settings"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors hover:bg-gray-100 text-gray-700"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors hover:bg-gray-100 text-gray-700"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors hover:bg-gray-100 text-gray-700"
          >
            <LogIn className="w-5 h-5" />
            <span className="font-medium">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
