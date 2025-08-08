import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Material } from '@/types';

interface EditMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
  onSave: (id: number, name: string, tags: string[]) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const EditMaterialModal: React.FC<EditMaterialModalProps> = ({ isOpen, onClose, material, onSave, onDelete }) => {
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (material) {
      setName(material.title);
      setTags(material.tags.join(', '));
    }
  }, [material]);

  const handleSave = () => {
    if (material) {
      onSave(material.id, name, tags.split(',').map(t => t.trim()));
    }
  };

  const handleDelete = () => {
    if (material) {
      onDelete(material.id);
    }
  };

  if (!material) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
