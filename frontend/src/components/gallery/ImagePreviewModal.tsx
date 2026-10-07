import Image from 'next/image';
import { Download, Share2, Edit2, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import { ImageItem } from '../../types/image';
import { formatDate } from '../../utils/format';

interface Props {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRemoveFromAlbum?: (img: ImageItem) => void;
}

export default function ImagePreviewModal({ image, isOpen, onClose, onEdit, onDelete, onRemoveFromAlbum }: Props) {
  if (!image) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Image Preview">
      <div className="space-y-6">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-brand-bgMain border border-brand-border">
          <Image src={image.imageUrl} alt={image.title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 800px" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-brand-textMain mb-4">{image.title}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-bgMain border border-brand-border rounded-xl p-4">
              <p className="text-brand-textMuted text-xs uppercase tracking-wider mb-1">Uploaded</p>
              <p className="text-brand-textMain font-medium">{formatDate(image.createdAt)}</p>
            </div>
            <div className="bg-brand-bgMain border border-brand-border rounded-xl p-4">
              <p className="text-brand-textMuted text-xs uppercase tracking-wider mb-1">Public ID</p>
              <p className="text-brand-textMain font-medium truncate" title={image.publicId}>{image.publicId}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button onClick={() => { onClose(); onEdit(); }} className="flex-1 flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Edit2 size={18} /> Edit Title
          </button>
          {onRemoveFromAlbum ? (
            <button onClick={() => { onClose(); onRemoveFromAlbum(image); }} className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 py-3 rounded-xl font-medium transition-colors">
              <Trash2 size={18} /> Remove from Album
            </button>
          ) : (
            <button onClick={() => { onClose(); onDelete(); }} className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 py-3 rounded-xl font-medium transition-colors">
              <Trash2 size={18} /> Delete Image
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}