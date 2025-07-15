// hooks/useDocumentModal.ts
import { useState } from 'react';
import { Document } from '@/types';

export const useDocumentModal = (getDoc: (id: number) => Promise<Document>) => {
  const [openedDocument, setOpenedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = async (documentId: number) => {
    try {
      setLoading(true);
      setError(null);
      const doc = await getDoc(documentId);
      setOpenedDocument(doc);
    } catch (err) {
      setError('Failed to load document');
      console.error('Error loading document:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setOpenedDocument(null);
    setError(null);
  };

  return {
    openedDocument,
    loading,
    error,
    openModal,
    closeModal,
    isOpen: !!openedDocument
  };
};