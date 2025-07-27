import React from 'react';
import { Search, Filter, ChevronRight, Calendar, Clock, FileText, Globe, Tag, Video, Book } from 'lucide-react';
import { Material, CategoryType } from '../types';
import { DocumentModal } from './DocumentModal';
import { useDocumentModal } from '../hooks/useDocumentModal';
import { useApiData } from './ApiProvider';

interface MaterialsExplorerProps {
  materials: Material[] | null;
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MaterialsExplorer: React.FC<MaterialsExplorerProps> = ({
  materials,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
}) => {
  const { getDoc } = useApiData();
  const { openedDocument, loading, error, openModal, closeModal, isOpen } = useDocumentModal(getDoc);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'book': return <Book className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-purple-600 bg-purple-100';
      case 'book': return 'text-blue-600 bg-blue-100';
      case 'website': return 'text-green-600 bg-green-100';
      case 'document': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredMaterials = materials?.filter(material => {
    const matchesCategory = selectedCategory === 'all' || material.type === selectedCategory;
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Knowledge Materials</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
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
                
                <button onClick={() => openModal(material.id)} className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
                  View Material
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DocumentModal
        document={openedDocument}
        isOpen={isOpen}
        loading={loading}
        error={error}
        onClose={closeModal}
        onRetry={() => openedDocument && openModal(openedDocument.document_id)}
      />
    </>
  );
};

export default MaterialsExplorer;
