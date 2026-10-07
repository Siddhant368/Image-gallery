import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Album } from '../../hooks/useAlbums';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  album?: Album | null;
}

export default function AlbumModal({ isOpen, onClose, onSave, album }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (album) {
        setName(album.name);
        setDescription(album.description || '');
      } else {
        setName('');
        setDescription('');
      }
      setError('');
    }
  }, [isOpen, album]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Album name is required');
      return;
    }
    onSave(name, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-brand-bgSecondary border border-brand-border rounded-2xl w-full max-w-md relative z-10 animate-scale-in overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-brand-border flex justify-between items-center bg-brand-bgCard">
          <h2 className="text-xl font-bold text-brand-textMain">
            {album ? 'Edit Album' : 'Create Album'}
          </h2>
          <button onClick={onClose} className="text-brand-textMuted hover:text-brand-textMain transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-textSecondary mb-1">Album Name *</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Summer Vacation"
                className="w-full bg-brand-bgMain border border-brand-border rounded-xl px-4 py-3 text-brand-textMain focus:outline-none focus:border-[#10B981] transition-colors"
                autoFocus
              />
              {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-textSecondary mb-1">Description (Optional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description about this album"
                className="w-full bg-brand-bgMain border border-brand-border rounded-xl px-4 py-3 text-brand-textMain focus:outline-none focus:border-[#10B981] transition-colors resize-none h-24"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border text-brand-textSecondary hover:bg-brand-bgCard transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#10B981] text-white hover:bg-[#059669] transition-colors font-medium shadow-lg shadow-[#10B981]/20"
            >
              {album ? 'Save Changes' : 'Create Album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
