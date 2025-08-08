import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFiles: (files: File[]) => Promise<void>;
  onAddUrl: (url: string) => Promise<void>;
  onAddText: (text: string) => Promise<void>;
  uploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen,
  onClose,
  onAddFiles,
  onAddUrl,
  onAddText,
  uploading,
  uploadProgress,
  error,
}) => {
  const [activeTab, setActiveTab] = useState('file');
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileSubmit = async () => {
    if (files.length > 0) {
      await onAddFiles(files);
      setFiles([]);
    }
  };

  const handleUrlSubmit = async () => {
    if (url) {
      await onAddUrl(url);
      setUrl('');
    }
  };

  const handleTextSubmit = async () => {
    if (text) {
      await onAddText(text);
      setText('');
    }
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
            <TabsTrigger value="text">From Text</TabsTrigger>
          </TabsList>
          <TabsContent value="file">
            <div {...getRootProps()} className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Selected files:</h4>
                <ul className="list-disc pl-5 mt-2">
                  {files.map((file, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span>{file.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={handleFileSubmit} disabled={files.length === 0 || uploading} className="mt-4 w-full">
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </TabsContent>
          <TabsContent value="url">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className="mt-4"
            />
            <Button onClick={handleUrlSubmit} disabled={!url || uploading} className="mt-4 w-full">
              {uploading ? 'Processing...' : 'Add from URL'}
            </Button>
          </TabsContent>
          <TabsContent value="text">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste text here"
              className="mt-4 w-full p-2 border rounded"
              rows={6}
            />
            <Button onClick={handleTextSubmit} disabled={!text || uploading} className="mt-4 w-full">
              {uploading ? 'Processing...' : 'Add Text'}
            </Button>
          </TabsContent>
        </Tabs>
        {uploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} />
            <p className="text-center text-sm mt-2">{uploadProgress}%</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
