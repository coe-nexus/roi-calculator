// components/DocumentModal.tsx
import React from 'react';
import { Document } from '@/types';


interface DocumentModalProps {
  document: Document | null;
  isOpen: boolean;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onRetry?: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ 
  document, 
  isOpen, 
  loading = false, 
  error = null, 
  onClose, 
  onRetry 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {loading ? 'Loading...' : document?.name || 'Document'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading document...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              {onRetry && (
                <button 
                  onClick={onRetry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {document && !loading && !error && (
            <div className="space-y-4">
              <p className="text-gray-700">{document.content}</p>
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm">
                  <span className="font-semibold">Link:</span> 
                  <a 
                    href={document.source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 ml-2"
                  >
                    {document.source}
                  </a>
                </p>
                
                <div className="text-sm">
                  <span className="font-semibold">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {document.keywords && document.keywords.length > 0 ? (
                      document.keywords.map((keyword, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"
                        >
                          {keyword.word}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs italic">No tags available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
