import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import Modal from '../common/Modal';
import { ImageItem } from '../../types/image';

interface Props {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export default function DeleteConfirmModal({ image, isOpen, onClose, onDelete }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');
      await onDelete(image!._id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  if (!image) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Image?">
      <div className="space-y-6">
        <div className="bg-brand-bgError border border-[#EF4444]/30 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2 bg-[#EF4444]/20 rounded-full text-[#EF4444] shrink-0">
            <Trash2 size={24} />
          </div>
          <div>
            <h4 className="text-brand-textMain font-medium mb-1">Are you sure you want to delete this image?</h4>
            <p className="text-brand-textMuted text-sm">"{image.title}" will be permanently removed. This action cannot be undone.</p>
          </div>
        </div>

        {error && <p className="text-[#EF4444] text-sm font-medium">{error}</p>}

        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-3 rounded-xl border border-brand-border text-brand-textSecondary hover:bg-brand-bgCard hover:text-brand-textMain font-medium transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading} className="flex-1 px-4 py-3 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white font-medium transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)] flex justify-center items-center disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}