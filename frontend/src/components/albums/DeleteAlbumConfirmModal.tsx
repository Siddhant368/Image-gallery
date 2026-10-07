import { X, AlertTriangle } from 'lucide-react';
import { Album } from '../../hooks/useAlbums';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  album: Album | null;
  onDelete: (id: string) => void;
}

export default function DeleteAlbumConfirmModal({ isOpen, onClose, album, onDelete }: Props) {
  if (!isOpen || !album) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-brand-bgSecondary border border-brand-border rounded-2xl w-full max-w-sm relative z-10 animate-scale-in overflow-hidden shadow-2xl">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-brand-bgError border border-[#EF4444] rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-[#EF4444]" size={32} />
          </div>
          
          <h2 className="text-xl font-bold text-brand-textMain mb-2">Delete Album?</h2>
          <p className="text-brand-textMuted mb-6">
            Are you sure you want to delete <span className="text-brand-textMain font-medium">"{album.name}"</span>? 
            This will only remove the album. The actual images will NOT be deleted.
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border text-brand-textSecondary hover:bg-brand-bgCard transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={() => { onDelete(album.id); onClose(); }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#EF4444] text-white hover:bg-[#DC2626] transition-colors font-medium shadow-lg shadow-[#EF4444]/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
