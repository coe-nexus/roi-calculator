import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Material } from "@/types";
import { getDocuments } from "@/services/api"
import { Document } from "@/types";

interface ApiContextType {
  materials: Material[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface ApiProviderProps {
  children: ReactNode;
}

// Create context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Custom hook to use the context
// eslint-disable-next-line react-refresh/only-export-components
export const useApiData = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error(" must be used within an ApiProvider");
  }
  return context;
};

function getMaterialType(content_type: string): "video" | "book" | "website" | "document" {
  // Normalize content type to lowercase and extract main type
  const normalizedType = content_type.toLowerCase().split(';')[0].trim();
  
  // Video content types
  if (normalizedType.startsWith('video/') || 
      normalizedType.includes('video') ||
      normalizedType === 'application/x-shockwave-flash' ||
      normalizedType === 'application/vnd.adobe.flash-movie') {
    return 'video';
  }
  
  // Book/eBook content types
  if (normalizedType === 'application/epub+zip' ||
      normalizedType === 'application/x-mobipocket-ebook' ||
      normalizedType === 'application/vnd.amazon.ebook' ||
      normalizedType === 'application/x-fictionbook+xml' ||
      normalizedType === 'application/vnd.ms-reader') {
    return 'book';
  }
  
  // Website content types
  if (normalizedType === 'text/html' ||
      normalizedType === 'application/xhtml+xml' ||
      normalizedType === 'text/css' ||
      normalizedType === 'application/javascript' ||
      normalizedType === 'text/javascript') {
    return 'website';
  }
  
  // Document content types (everything else - text files, PDFs, Word docs, etc.)
  return 'document';
}
// Provider component
export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Expensive API call
  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const docs = await getDocuments()
      const materials : Material[] = []
      for (let i = 0;  i < docs.length; i++){
        const doc : Document = docs[i]
        const kws : string[] = []
        doc.keywords.forEach((value) => {
          kws.push(value.word)
        })
        materials.push(
          {
            id: doc.document_id,
            title: doc.name,
            type: getMaterialType(doc.description),
            tags: kws,
            date: new Date().toISOString()
          }
        )
      }

      setMaterials(materials)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const contextValue: ApiContextType = {
    materials,
    loading,
    error,
    refetch: fetchData,
  };

  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
};
