// Types from API Calls (mirrors of Schemas from the backend)
export interface Document {
    document_id: number;
    name: string;
    description: string; // the description is really just the content type for now
    content: string | undefined;
    source: string | undefined;
}

// OTHER TYPES
export interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
}

export interface Material {
  id: number;
  title: string;
  type: 'video' | 'book' | 'website' | 'document';
  duration?: string;
  pages?: number;
  url?: string;
  tags: string[];
  date: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'material' | 'tag';
  materialType?: 'video' | 'book' | 'website' | 'document';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  fx?: number;
  fy?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
}

export type TabType = 'home' | 'materials' | 'repository';
export type CategoryType = 'all' | 'video' | 'book' | 'website' | 'document';