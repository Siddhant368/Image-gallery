import Image from 'next/image';
import { MoreVertical, Heart, Eye, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ImageItem } from '../../types/image';
import { formatDate } from '../../utils/format';

interface Props {
  image: ImageItem;
  view: 'grid' | 'list';
  isFavorite: boolean;
  onToggleFavorite: (img: ImageItem) => void;
  onEdit: (img: ImageItem) => void;
  onDelete: (img: ImageItem) => void;
  onPreview: (img: ImageItem) => void;
  onRemoveFromAlbum?: (img: ImageItem) => void;
}

export default function ImageCard({ image, view, isFavorite, onToggleFavorite, onEdit, onDelete, onPreview, onRemoveFromAlbum }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 300);
    onToggleFavorite(image);
  };

  if (view === 'list') {
    return (
      <div className="flex items-center gap-4 bg-brand-bgCard border border-brand-border p-4 rounded-xl hover:border-[#10B981]/50 transition-all group">
        <div className="w-24 h-24 relative rounded-lg overflow-hidden shrink-0 cursor-pointer" onClick={() => onPreview(image)}>
          <Image src={image.imageUrl} alt={image.title} fill className="object-cover" sizes="96px" />
        </div>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onPreview(image)}>
          <h4 className="text-brand-textMain font-semibold truncate mb-1">{image.title}</h4>
          <p className="text-brand-textMuted text-sm">{formatDate(image.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleFavoriteClick} 
            className={`p-2 rounded-full hover:bg-brand-bgSecondary transition-transform duration-300 ${heartAnim ? 'scale-110' : ''}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={18} className={isFavorite ? "fill-[#10B981] text-[#10B981]" : "text-brand-textMuted"} />
          </button>
          <button onClick={() => onEdit(image)} className="p-2 rounded-full hover:bg-brand-bgSecondary text-brand-textMuted hover:text-[#10B981] transition-colors">
            <Edit2 size={18} />
          </button>
          {onRemoveFromAlbum ? (
            <button onClick={() => onRemoveFromAlbum(image)} className="p-2 rounded-full hover:bg-brand-bgSecondary text-brand-textMuted hover:text-[#EF4444] transition-colors" title="Remove from album">
              <Trash2 size={18} />
            </button>
          ) : (
            <button onClick={() => onDelete(image)} className="p-2 rounded-full hover:bg-brand-bgSecondary text-brand-textMuted hover:text-[#EF4444] transition-colors">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bgCard border border-brand-border rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] hover:border-[#10B981]/50 transition-all duration-300 relative">
      <div className="aspect-[16/10] relative overflow-hidden bg-brand-bgSecondary cursor-pointer" onClick={() => onPreview(image)}>
        <Image 
          src={image.imageUrl} 
          alt={image.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03110D]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="flex gap-2 w-full">
            <button onClick={(e) => { e.stopPropagation(); onEdit(image); }} className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
              <Edit2 size={14} /> Edit
            </button>
            {onRemoveFromAlbum ? (
              <button onClick={(e) => { e.stopPropagation(); onRemoveFromAlbum(image); }} className="flex-1 bg-transparent hover:bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                <Trash2 size={14} /> Remove
              </button>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); onDelete(image); }} className="flex-1 bg-transparent hover:bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 flex items-start justify-between gap-2">
        <div className="min-w-0 cursor-pointer flex-1" onClick={() => onPreview(image)}>
          <h4 className="text-brand-textMain font-medium truncate mb-1" title={image.title}>{image.title}</h4>
          <p className="text-brand-textMuted text-xs font-medium">{formatDate(image.createdAt)}</p>
        </div>
        
        <div className="flex items-center gap-1 shrink-0 relative">
          <button 
            onClick={handleFavoriteClick} 
            className={`p-1.5 rounded-full hover:bg-brand-bgSecondary transition-transform duration-300 ${heartAnim ? 'scale-110' : ''}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={16} className={isFavorite ? "fill-[#10B981] text-[#10B981]" : "text-brand-textMuted"} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-full hover:bg-brand-bgSecondary transition-colors text-brand-textMuted"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}></div>
              <div className="absolute right-0 top-full mt-1 w-36 bg-brand-bgSecondary border border-brand-border rounded-xl shadow-xl z-20 overflow-hidden py-1">
                <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onPreview(image); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-brand-textSecondary hover:bg-brand-bgCard hover:text-brand-textMain">
                  <Eye size={14} /> View
                </button>
                <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(image); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-brand-textSecondary hover:bg-brand-bgCard hover:text-brand-textMain">
                  <Edit2 size={14} /> Edit Title
                </button>
                <div className="h-px bg-[#173B30] my-1"></div>
                {onRemoveFromAlbum ? (
                  <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onRemoveFromAlbum(image); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10">
                    <Trash2 size={14} /> Remove from Album
                  </button>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(image); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10">
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}