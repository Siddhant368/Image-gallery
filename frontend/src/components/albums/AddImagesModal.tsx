import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { ImageItem } from '../../types/image';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageIds: string[]) => void;
  allImages: ImageItem[];
  existingImageIds: string[];
}

export default function AddImagesModal({ isOpen, onClose, onSave, allImages, existingImageIds }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const availableImages = allImages.filter(img => !existingImageIds.includes(img._id));

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSubmit = () => {
    onSave(Array.from(selectedIds));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-brand-bgSecondary border border-brand-border rounded-2xl w-full max-w-2xl relative z-10 animate-scale-in overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-brand-border flex justify-between items-center bg-brand-bgCard shrink-0">
          <div>
            <h2 className="text-xl font-bold text-brand-textMain">Add Images to Album</h2>
            <p className="text-brand-textMuted text-sm mt-1">{selectedIds.size} selected</p>
          </div>
          <button onClick={onClose} className="text-brand-textMuted hover:text-brand-textMain transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {availableImages.length === 0 ? (
            <div className="text-center py-12 text-brand-textMuted">
              <p>No available images to add.</p>
              <p className="text-sm mt-2">All your gallery images are already in this album, or your gallery is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {availableImages.map(img => {
                const isSelected = selectedIds.has(img._id);
                return (
                  <div 
                    key={img._id}
                    onClick={() => toggleSelect(img._id)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? 'border-[#10B981]' : 'border-transparent hover:border-brand-border'}`}
                  >
                    <Image src={img.imageUrl} alt={img.title} fill className="object-cover" sizes="150px" />
                    <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-[#10B981]/20' : 'bg-black/20 group-hover:bg-transparent'}`}></div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-[#10B981] text-white p-1 rounded-full shadow-lg">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-brand-textMain text-xs truncate font-medium">{img.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-brand-border bg-brand-bgCard flex gap-3 shrink-0">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border text-brand-textSecondary hover:bg-brand-bgCard transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={selectedIds.size === 0}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg ${selectedIds.size > 0 ? 'bg-[#10B981] text-white hover:bg-[#059669] shadow-[#10B981]/20' : 'bg-[#173B30] text-brand-textMuted cursor-not-allowed'}`}
          >
            Add Selected Images
          </button>
        </div>
      </div>
    </div>
  );
}
