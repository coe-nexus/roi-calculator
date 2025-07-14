import React, { useState } from 'react';
import { Send, Book, Video, Globe, FileText, Search, Filter, ChevronRight, Home, Library, Network, Bot, User, Tag, Calendar, Clock } from 'lucide-react';
import { TabType, Message, CategoryType } from '../types'
import { ApiProvider, useApiData } from '@/components/provider';
import { GraphView } from '@/components/graph';


const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'bot', content: 'Hello! I\'m Atlas, your AI teacher. What would you like to learn about today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { materials } = useApiData()

  const getIcon = (type: string) => {
    switch(type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'book': return <Book className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'video': return 'text-purple-600 bg-purple-100';
      case 'book': return 'text-blue-600 bg-blue-100';
      case 'website': return 'text-green-600 bg-green-100';
      case 'document': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = { id: messages.length + 1, type: 'user', content: inputMessage };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = { 
          id: messages.length + 2, 
          type: 'bot', 
          content: `I understand you're asking about "${inputMessage}". Let me help you explore this topic using our knowledge base...` 
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const filteredMaterials = materials?.filter(material => {
    const matchesCategory = selectedCategory === 'all' || material.type === selectedCategory;
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Interface */}
        {activeTab === 'home' && (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        {message.type === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-gray-600" />}
                      </div>
                      <div className={`rounded-lg px-4 py-3 ${
                        message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4">
              <div className="max-w-3xl mx-auto flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Atlas anything..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </div>
              
            </div>
          </>
        )}

        {/* Materials Explorer */}
        {activeTab === 'materials' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Knowledge Materials</h2>
              
              {/* Search and Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search materials or tags..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="video">Videos</option>
                      <option value="book">Books</option>
                      <option value="website">Websites</option>
                      <option value="document">Documents</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Materials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMaterials?.map((material) => (
                  <div key={material.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                        {getIcon(material.type)}
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(material.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2">{material.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {material.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {material.duration}
                        </span>
                      )}
                      {material.pages && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {material.pages} pages
                        </span>
                      )}
                      {material.url && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {material.url}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {material.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
                      View Material
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Repository Graph View */}
        {activeTab === 'repository' && (
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
        )}
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ApiProvider>
      <Dashboard />
    </ApiProvider>
    
  );
};

export default App;