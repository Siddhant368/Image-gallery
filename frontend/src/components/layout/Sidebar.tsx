import { Image as ImageIcon, CloudUpload, Heart, Layers, Settings, ChevronDown } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFavorites } from '../../hooks/useFavorites';
import { useSettings } from '../../hooks/useSettings';

export default function Sidebar({ onUploadClick }: { onUploadClick: () => void }) {
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { settings } = useSettings();

  const isGallery = pathname === '/';
  const isFavorites = pathname === '/favorites';

  return (
    <aside className="w-64 bg-brand-bgSecondary border-r border-brand-border h-screen fixed left-0 top-0 flex flex-col hidden xl:flex">
      <div className="p-6">
        <div className="flex items-center gap-3 text-[#10B981] mb-2">
          <ImageIcon size={28} />
          <h1 className="text-xl font-bold text-brand-textMain tracking-wide">ImageGallery</h1>
        </div>
        <p className="text-xs text-brand-textMuted tracking-wider uppercase font-medium">Capture • Organize • Share</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link 
          href="/" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isGallery ? 'bg-[#10B981] text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'text-brand-textSecondary hover:bg-brand-bgCard hover:text-white'}`}
        >
          <ImageIcon size={20} /> Gallery
        </Link>
        <button onClick={onUploadClick} className="w-full flex items-center gap-3 px-4 py-3 text-brand-textSecondary hover:bg-brand-bgCard hover:text-brand-textMain rounded-xl transition-colors font-medium">
          <CloudUpload size={20} /> Upload
        </button>
        <Link 
          href="/favorites" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isFavorites ? 'bg-[#10B981] text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'text-brand-textSecondary hover:bg-brand-bgCard hover:text-white'}`}
        >
          <Heart size={20} /> Favorites
          {favorites.length > 0 && (
            <span className="ml-auto bg-[#10B981] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {favorites.length}
            </span>
          )}
        </Link>
        <Link 
          href="/albums" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${pathname.startsWith('/albums') ? 'bg-[#10B981] text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'text-brand-textSecondary hover:bg-brand-bgCard hover:text-white'}`}
        >
          <Layers size={20} /> Albums
        </Link>
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${pathname === '/settings' ? 'bg-[#10B981] text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'text-brand-textSecondary hover:bg-brand-bgCard hover:text-white'}`}
        >
          <Settings size={20} /> Settings
        </Link>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-brand-bgCard rounded-xl p-4 mb-4 border border-brand-border">
          <p className="text-sm text-brand-textMain font-medium mb-1">Your memories, beautifully organized.</p>
          <p className="text-xs text-brand-textMuted">Store, manage and cherish your favorite moments.</p>
        </div>
        
        <div className="flex items-center gap-3 px-2 cursor-pointer hover:bg-brand-bgCard p-2 rounded-xl transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold">
            {settings?.displayName ? settings.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-medium text-brand-textMain truncate">{settings?.displayName || 'User'}</h4>
            <p className="text-xs text-brand-textMuted truncate">{settings?.email || 'user@example.com'}</p>
          </div>
          <ChevronDown size={16} className="text-brand-textMuted" />
        </div>
      </div>
    </aside>
  );
}