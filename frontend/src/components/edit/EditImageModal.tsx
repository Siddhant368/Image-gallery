import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { ImageItem } from '../../types/image';

interface Props {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, title: string) => Promise<void>;
}

export default function EditImageModal({ image, isOpen, onClose, onUpdate }: Props) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (image) setTitle(image.title);
  }, [image]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await onUpdate(image!._id, title);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update image');
    } finally {
      setLoading(false);
    }
  };

  if (!image) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Image">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-brand-textSecondary mb-2">Image Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full bg-brand-bgMain border border-brand-border rounded-xl px-4 py-3 text-brand-textMain focus:outline-none focus:border-[#10B981] transition-colors"
          />
        </div>

        {error && <p className="text-[#EF4444] text-sm font-medium">{error}</p>}

        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-3 rounded-xl border border-brand-border text-brand-textSecondary hover:bg-brand-bgCard hover:text-brand-textMain font-medium transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || title === image.title} className="flex-1 px-4 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] flex justify-center items-center disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
}