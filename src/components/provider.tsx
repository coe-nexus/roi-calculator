import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Material } from "@/types";

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
export const useApiData = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiData must be used within an ApiProvider");
  }
  return context;
};

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

      // Simulate expensive API call
      // Mock data for materials
      const materials: Material[] = [
        {
          id: 1,
          title: "Introduction to Machine Learning",
          type: "video",
          duration: "45 mins",
          tags: ["AI", "ML", "Basics"],
          date: "2024-12-01",
        },
        {
          id: 2,
          title: "Deep Learning Fundamentals",
          type: "book",
          pages: 320,
          tags: ["AI", "Deep Learning", "Neural Networks"],
          date: "2024-11-15",
        },
        {
          id: 3,
          title: "TensorFlow Documentation",
          type: "website",
          url: "tensorflow.org",
          tags: ["Framework", "ML", "Tools"],
          date: "2024-12-10",
        },
        {
          id: 4,
          title: "Neural Network Architecture",
          type: "document",
          pages: 45,
          tags: ["Neural Networks", "Architecture", "AI"],
          date: "2024-11-20",
        },
        {
          id: 5,
          title: "PyTorch Tutorial Series",
          type: "video",
          duration: "3 hours",
          tags: ["Framework", "PyTorch", "Tutorial"],
          date: "2024-12-05",
        },
        {
          id: 6,
          title: "AI Ethics and Society",
          type: "book",
          pages: 256,
          tags: ["Ethics", "AI", "Society"],
          date: "2024-10-30",
        },
        {
          id: 7,
          title: "Computer Vision Basics",
          type: "video",
          duration: "1.5 hours",
          tags: ["Computer Vision", "AI", "Basics"],
          date: "2024-12-08",
        },
        {
          id: 8,
          title: "NLP Research Papers",
          type: "document",
          pages: 120,
          tags: ["NLP", "Research", "AI"],
          date: "2024-11-25",
        },
      ];
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
