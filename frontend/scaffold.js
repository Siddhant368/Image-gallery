const fs = require('fs');
const path = require('path');

const files = {
  'src/components/layout/Sidebar.tsx': `
import { Image as ImageIcon, CloudUpload, Heart, Layers, Settings, ChevronDown } from 'lucide-react';
import React from 'react';

export default function Sidebar({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <aside className="w-64 bg-[#071A15] border-r border-[#173B30] h-screen fixed left-0 top-0 flex flex-col hidden xl:flex">
      <div className="p-6">
        <div className="flex items-center gap-3 text-[#10B981] mb-2">
          <ImageIcon size={28} />
          <h1 className="text-xl font-bold text-white tracking-wide">ImageGallery</h1>
        </div>
        <p className="text-xs text-[#86A99A] tracking-wider uppercase font-medium">Capture • Organize • Share</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#10B981] text-white rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] font-medium">
          <ImageIcon size={20} /> Gallery
        </a>
        <button onClick={onUploadClick} className="w-full flex items-center gap-3 px-4 py-3 text-[#B7D3C7] hover:bg-[#0B211A] hover:text-white rounded-xl transition-colors font-medium">
          <CloudUpload size={20} /> Upload
        </button>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#B7D3C7] hover:bg-[#0B211A] hover:text-white rounded-xl transition-colors font-medium">
          <Heart size={20} /> Favorites
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#B7D3C7] hover:bg-[#0B211A] hover:text-white rounded-xl transition-colors font-medium">
          <Layers size={20} /> Albums
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#B7D3C7] hover:bg-[#0B211A] hover:text-white rounded-xl transition-colors font-medium">
          <Settings size={20} /> Settings
        </a>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-[#0B211A] rounded-xl p-4 mb-4 border border-[#173B30]">
          <p className="text-sm text-white font-medium mb-1">Your memories, beautifully organized.</p>
          <p className="text-xs text-[#86A99A]">Store, manage and cherish your favorite moments.</p>
        </div>
        
        <div className="flex items-center gap-3 px-2 cursor-pointer hover:bg-[#0B211A] p-2 rounded-xl transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold">
            S
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-medium text-white truncate">Siddhant Singh</h4>
            <p className="text-xs text-[#86A99A] truncate">siddhant@gmail.com</p>
          </div>
          <ChevronDown size={16} className="text-[#86A99A]" />
        </div>
      </div>
    </aside>
  );
}
  `,

  'src/components/layout/Topbar.tsx': `
import { Search, Sun, Bell, Plus, Menu } from 'lucide-react';

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onUploadClick: () => void;
  onMenuClick?: () => void;
}

export default function Topbar({ searchQuery, setSearchQuery, onUploadClick, onMenuClick }: TopbarProps) {
  return (
    <header className="h-20 bg-[#071A15]/80 backdrop-blur-md border-b border-[#173B30] flex items-center justify-between px-6 sticky top-0 z-40 xl:pl-6">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="xl:hidden text-[#B7D3C7] hover:text-white">
          <Menu size={24} />
        </button>
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86A99A]" size={18} />
          <input
            type="text"
            placeholder="Search images by title, tag or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#03110D] border border-[#173B30] rounded-full py-2.5 pl-11 pr-14 text-white text-sm focus:outline-none focus:border-[#10B981] transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block bg-[#0B211A] text-[#86A99A] text-[10px] px-1.5 py-0.5 rounded border border-[#173B30]">⌘</kbd>
            <kbd className="hidden sm:inline-block bg-[#0B211A] text-[#86A99A] text-[10px] px-1.5 py-0.5 rounded border border-[#173B30]">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-[#B7D3C7] hover:text-white transition-colors">
          <Sun size={20} />
        </button>
        <button className="text-[#B7D3C7] hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>
        <button onClick={onUploadClick} className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Plus size={18} /> <span className="hidden sm:inline">Upload Image</span>
        </button>
      </div>
    </header>
  );
}
  `,

  'src/components/dashboard/HeroSection.tsx': `
import { Image as ImageIcon, Cloud, ShieldCheck } from 'lucide-react';
import { formatBytes } from '../../utils/format';

export default function HeroSection({ totalImages, onUpload }: { totalImages: number, onUpload: () => void }) {
  // Assuming average 2MB per image if no size provided
  const estimatedSize = totalImages * 2 * 1024 * 1024; 
  
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 bg-[#0B211A] border border-[#173B30]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#03110D]/95 via-[#03110D]/80 to-transparent z-10"></div>
      
      {/* Background decoration - normally an image, but using CSS gradient to keep it self-contained */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#064E3B] to-[#03110D] opacity-40"></div>
      
      <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <p className="text-[#10B981] font-semibold text-sm tracking-wider uppercase mb-2">Welcome to Image Gallery</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Discover <span className="text-[#10B981]">Beautiful</span> Moments
          </h2>
          <p className="text-[#B7D3C7] text-lg mb-8 max-w-md leading-relaxed">
            Your personal space to store, organize and manage your favorite images.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={onUpload} className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              + Upload Image
            </button>
            <button className="bg-transparent border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 px-6 py-3 rounded-xl font-medium transition-colors">
              Explore Gallery
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="bg-[#03110D]/60 backdrop-blur-md border border-[#173B30] p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#064E3B] text-[#10B981] flex items-center justify-center">
              <ImageIcon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalImages}</p>
              <p className="text-xs text-[#86A99A] uppercase tracking-wider">Total Images</p>
            </div>
          </div>
          
          <div className="bg-[#03110D]/60 backdrop-blur-md border border-[#173B30] p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#064E3B] text-[#10B981] flex items-center justify-center">
              <Cloud size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatBytes(estimatedSize)}</p>
              <p className="text-xs text-[#86A99A] uppercase tracking-wider">Storage Used</p>
            </div>
          </div>

          <div className="bg-[#03110D]/60 backdrop-blur-md border border-[#173B30] p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#064E3B] text-[#10B981] flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-[#86A99A] uppercase tracking-wider">Secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  `,

  'src/components/gallery/CategoryFilters.tsx': `
export default function CategoryFilters() {
  const categories = ['All', 'Nature', 'Travel', 'Architecture', 'Animals', 'Cars', 'People', 'Other'];
  
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((cat, i) => (
        <button
          key={cat}
          className={\`px-5 py-2 rounded-full text-sm font-medium transition-all \${
            i === 0 
              ? 'bg-[#10B981] text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-[#10B981]' 
              : 'bg-[#0B211A] text-[#B7D3C7] border border-[#173B30] hover:border-[#10B981] hover:text-white'
          }\`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
  `,

  'src/components/gallery/GalleryToolbar.tsx': `
import { LayoutGrid, List, ChevronDown } from 'lucide-react';

interface Props {
  sort: string;
  setSort: (s: string) => void;
  view: 'grid' | 'list';
  setView: (v: 'grid' | 'list') => void;
}

export default function GalleryToolbar({ sort, setSort, view, setView }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
      <h3 className="text-xl font-bold text-white">All Images</h3>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none bg-[#0B211A] border border-[#173B30] text-[#B7D3C7] py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:border-[#10B981] cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86A99A] pointer-events-none" />
        </div>

        <div className="flex items-center bg-[#0B211A] border border-[#173B30] rounded-lg p-1">
          <button 
            onClick={() => setView('grid')}
            className={\`p-1.5 rounded-md transition-colors \${view === 'grid' ? 'bg-[#10B981] text-white' : 'text-[#86A99A] hover:text-white'}\`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setView('list')}
            className={\`p-1.5 rounded-md transition-colors \${view === 'list' ? 'bg-[#10B981] text-white' : 'text-[#86A99A] hover:text-white'}\`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
  `,

  'src/components/common/Toast.tsx': `
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 animate-slide-up">
      <div className={\`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border \${
        type === 'success' 
          ? 'bg-[#0B211A] border-[#10B981] text-white' 
          : 'bg-[#1F0909] border-[#EF4444] text-white'
      }\`}>
        {type === 'success' ? <CheckCircle2 className="text-[#10B981]" size={20} /> : <XCircle className="text-[#EF4444]" size={20} />}
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
  `,

  'src/components/common/Modal.tsx': `
import { X } from 'lucide-react';
import React, { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#03110D]/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#071A15] border border-[#173B30] rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#173B30]">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-[#86A99A] hover:text-white transition-colors bg-[#0B211A] p-2 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
  `,

  'src/components/gallery/ImageCard.tsx': `
import Image from 'next/image';
import { MoreVertical, Heart, Eye, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ImageItem } from '../../types/image';
import { formatDate } from '../../utils/format';

interface Props {
  image: ImageItem;
  view: 'grid' | 'list';
  onEdit: (img: ImageItem) => void;
  onDelete: (img: ImageItem) => void;
  onPreview: (img: ImageItem) => void;
}

export default function ImageCard({ image, view, onEdit, onDelete, onPreview }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (view === 'list') {
    return (
      <div className="flex items-center gap-4 bg-[#0B211A] border border-[#173B30] p-4 rounded-xl hover:border-[#10B981]/50 transition-all group">
        <div className="w-24 h-24 relative rounded-lg overflow-hidden shrink-0 cursor-pointer" onClick={() => onPreview(image)}>
          <Image src={image.imageUrl} alt={image.title} fill className="object-cover" sizes="96px" />
        </div>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onPreview(image)}>
          <h4 className="text-white font-semibold truncate mb-1">{image.title}</h4>
          <p className="text-[#86A99A] text-sm">{formatDate(image.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 rounded-full hover:bg-[#071A15] transition-colors">
            <Heart size={18} className={isFavorite ? "fill-[#10B981] text-[#10B981]" : "text-[#86A99A]"} />
          </button>
          <button onClick={() => onEdit(image)} className="p-2 rounded-full hover:bg-[#071A15] text-[#86A99A] hover:text-[#10B981] transition-colors">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(image)} className="p-2 rounded-full hover:bg-[#071A15] text-[#86A99A] hover:text-[#EF4444] transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B211A] border border-[#173B30] rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] hover:border-[#10B981]/50 transition-all duration-300 relative">
      <div className="aspect-[16/10] relative overflow-hidden bg-[#071A15] cursor-pointer" onClick={() => onPreview(image)}>
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
            <button onClick={(e) => { e.stopPropagation(); onDelete(image); }} className="flex-1 bg-transparent hover:bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex items-start justify-between gap-2">
        <div className="min-w-0 cursor-pointer flex-1" onClick={() => onPreview(image)}>
          <h4 className="text-white font-medium truncate mb-1" title={image.title}>{image.title}</h4>
          <p className="text-[#86A99A] text-xs font-medium">{formatDate(image.createdAt)}</p>
        </div>
        
        <div className="flex items-center gap-1 shrink-0 relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }} 
            className="p-1.5 rounded-full hover:bg-[#071A15] transition-colors"
          >
            <Heart size={16} className={isFavorite ? "fill-[#10B981] text-[#10B981]" : "text-[#86A99A]"} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-full hover:bg-[#071A15] transition-colors text-[#86A99A]"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}></div>
              <div className="absolute right-0 top-full mt-1 w-36 bg-[#071A15] border border-[#173B30] rounded-xl shadow-xl z-20 overflow-hidden py-1">
                <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onPreview(image); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#B7D3C7] hover:bg-[#0B211A] hover:text-white">
                  <Eye size={14} /> View
                </button>
                <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(image); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#B7D3C7] hover:bg-[#0B211A] hover:text-white">
                  <Edit2 size={14} /> Edit Title
                </button>
                <div className="h-px bg-[#173B30] my-1"></div>
                <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(image); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
  `,

  'src/components/upload/UploadModal.tsx': `
import { CloudUpload, X } from 'lucide-react';
import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Modal from '../common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (title: string, file: File) => Promise<void>;
}

export default function UploadModal({ isOpen, onClose, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setError('');
    setPreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateFile = (f: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(f.type)) {
      setError('Unsupported file type. Use JPG, PNG or WEBP.');
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return false;
    }
    setError('');
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (validateFile(f)) {
        setFile(f);
        setPreview(URL.createObjectURL(f));
        if (!title) {
          setTitle(f.name.split('.')[0]);
        }
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      if (validateFile(f)) {
        setFile(f);
        setPreview(URL.createObjectURL(f));
        if (!title) {
          setTitle(f.name.split('.')[0]);
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image.');
      return;
    }
    if (!title.trim()) {
      setError('Image title is required.');
      return;
    }
    if (title.length > 100) {
      setError('Title must be less than 100 characters.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onUpload(title, file);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Image">
      <div className="space-y-6">
        {!file ? (
          <div 
            className="border-2 border-dashed border-[#10B981]/40 hover:border-[#10B981] bg-[#03110D]/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-4 text-[#10B981]">
              <CloudUpload size={32} />
            </div>
            <h4 className="text-white font-medium mb-1">Drag & drop your image here</h4>
            <p className="text-[#86A99A] text-sm mb-4">or click to browse</p>
            <div className="text-xs text-[#86A99A] bg-[#0B211A] px-3 py-1 rounded-full border border-[#173B30]">
              JPG, JPEG, PNG, WEBP • Maximum 5MB
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/png,image/webp" className="hidden" />
          </div>
        ) : (
          <div className="bg-[#03110D] rounded-2xl p-4 border border-[#173B30]">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-[#071A15]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview!} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-[#EF4444] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between px-2">
              <p className="text-sm font-medium text-white truncate mr-4">{file.name}</p>
              <p className="text-xs text-[#86A99A] whitespace-nowrap">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#B7D3C7] mb-2">Image Title *</label>
          <input 
            type="text" 
            placeholder="Enter image title..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full bg-[#03110D] border border-[#173B30] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] transition-colors"
          />
        </div>

        {error && <p className="text-[#EF4444] text-sm font-medium">{error}</p>}

        <div className="flex gap-3 pt-4 border-t border-[#173B30]">
          <button onClick={handleClose} disabled={loading} className="flex-1 px-4 py-3 rounded-xl border border-[#173B30] text-[#B7D3C7] hover:bg-[#0B211A] hover:text-white font-medium transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || !file} className="flex-1 px-4 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] flex justify-center items-center disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Upload Image'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
  `,

  'src/components/edit/EditImageModal.tsx': `
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
          <label className="block text-sm font-medium text-[#B7D3C7] mb-2">Image Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full bg-[#03110D] border border-[#173B30] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] transition-colors"
          />
        </div>

        {error && <p className="text-[#EF4444] text-sm font-medium">{error}</p>}

        <div className="flex gap-3 pt-4 border-t border-[#173B30]">
          <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-3 rounded-xl border border-[#173B30] text-[#B7D3C7] hover:bg-[#0B211A] hover:text-white font-medium transition-colors disabled:opacity-50">
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
  `,

  'src/components/delete/DeleteConfirmModal.tsx': `
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
        <div className="bg-[#1F0909] border border-[#EF4444]/30 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2 bg-[#EF4444]/20 rounded-full text-[#EF4444] shrink-0">
            <Trash2 size={24} />
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Are you sure you want to delete this image?</h4>
            <p className="text-[#86A99A] text-sm">"{image.title}" will be permanently removed. This action cannot be undone.</p>
          </div>
        </div>

        {error && <p className="text-[#EF4444] text-sm font-medium">{error}</p>}

        <div className="flex gap-3 pt-4 border-t border-[#173B30]">
          <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-3 rounded-xl border border-[#173B30] text-[#B7D3C7] hover:bg-[#0B211A] hover:text-white font-medium transition-colors disabled:opacity-50">
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
  `,

  'src/components/gallery/ImagePreviewModal.tsx': `
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
}

export default function ImagePreviewModal({ image, isOpen, onClose, onEdit, onDelete }: Props) {
  if (!image) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Image Preview">
      <div className="space-y-6">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-[#03110D] border border-[#173B30]">
          <Image src={image.imageUrl} alt={image.title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 800px" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">{image.title}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#03110D] border border-[#173B30] rounded-xl p-4">
              <p className="text-[#86A99A] text-xs uppercase tracking-wider mb-1">Uploaded</p>
              <p className="text-white font-medium">{formatDate(image.createdAt)}</p>
            </div>
            <div className="bg-[#03110D] border border-[#173B30] rounded-xl p-4">
              <p className="text-[#86A99A] text-xs uppercase tracking-wider mb-1">Public ID</p>
              <p className="text-white font-medium truncate" title={image.publicId}>{image.publicId}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[#173B30]">
          <button onClick={() => { onClose(); onEdit(); }} className="flex-1 flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Edit2 size={18} /> Edit Title
          </button>
          <button onClick={() => { onClose(); onDelete(); }} className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 py-3 rounded-xl font-medium transition-colors">
            <Trash2 size={18} /> Delete Image
          </button>
        </div>
      </div>
    </Modal>
  );
}
  `,

  'src/components/gallery/EmptyGallery.tsx': `
import { Images } from 'lucide-react';

export default function EmptyGallery({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-[#173B30] rounded-2xl bg-[#0B211A]/50">
      <div className="w-20 h-20 bg-[#071A15] border border-[#173B30] rounded-full flex items-center justify-center mb-6 text-[#10B981]">
        <Images size={40} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No images yet</h3>
      <p className="text-[#B7D3C7] mb-8 max-w-sm">
        Start building your gallery by uploading your first image.
      </p>
      <button onClick={onUpload} className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        + Upload Image
      </button>
    </div>
  );
}
  `,
  
  'src/components/gallery/ImageSkeleton.tsx': `
export default function ImageSkeleton({ view }: { view: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <div className="flex items-center gap-4 bg-[#0B211A] border border-[#173B30] p-4 rounded-xl animate-pulse">
        <div className="w-24 h-24 bg-[#173B30] rounded-lg shrink-0"></div>
        <div className="flex-1">
          <div className="h-5 bg-[#173B30] rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-[#173B30] rounded w-1/4"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-[#173B30]"></div>
          <div className="w-8 h-8 rounded-full bg-[#173B30]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B211A] border border-[#173B30] rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-[#173B30]"></div>
      <div className="p-4">
        <div className="h-5 bg-[#173B30] rounded w-3/4 mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-[#173B30] rounded w-1/3"></div>
          <div className="w-8 h-8 rounded-full bg-[#173B30]"></div>
        </div>
      </div>
    </div>
  );
}
  `,

  'src/app/page.tsx': `
"use client";

import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import HeroSection from '../components/dashboard/HeroSection';
import CategoryFilters from '../components/gallery/CategoryFilters';
import GalleryToolbar from '../components/gallery/GalleryToolbar';
import ImageCard from '../components/gallery/ImageCard';
import ImageSkeleton from '../components/gallery/ImageSkeleton';
import EmptyGallery from '../components/gallery/EmptyGallery';
import UploadModal from '../components/upload/UploadModal';
import EditImageModal from '../components/edit/EditImageModal';
import DeleteConfirmModal from '../components/delete/DeleteConfirmModal';
import ImagePreviewModal from '../components/gallery/ImagePreviewModal';
import Toast, { ToastType } from '../components/common/Toast';
import { useImages } from '../hooks/useImages';
import { ImageItem } from '../types/image';
import { X, Image as ImageIcon, CloudUpload, Heart, Layers, Settings } from 'lucide-react';

export default function Dashboard() {
  const { 
    images, loading, error, 
    search, setSearch, sort, setSort, 
    uploadImage, updateImage, deleteImage 
  } = useImages();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  
  // Toast state
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);

  const showToast = (message: string, type: ToastType) => setToast({ message, type });

  const handleUpload = async (title: string, file: File) => {
    try {
      await uploadImage(title, file);
      showToast('Image uploaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload image', 'error');
      throw err;
    }
  };

  const handleUpdate = async (id: string, title: string) => {
    try {
      await updateImage(id, title);
      showToast('Image updated successfully', 'success');
      setSelectedImage(prev => prev?._id === id ? { ...prev, title } : prev);
    } catch (err: any) {
      showToast(err.message || 'Failed to update image', 'error');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteImage(id);
      showToast('Image deleted successfully', 'success');
      if (selectedImage?._id === id) setSelectedImage(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete image', 'error');
      throw err;
    }
  };

  const openEdit = (img: ImageItem) => {
    setSelectedImage(img);
    setIsEditOpen(true);
  };

  const openDelete = (img: ImageItem) => {
    setSelectedImage(img);
    setIsDeleteOpen(true);
  };

  const openPreview = (img: ImageItem) => {
    setSelectedImage(img);
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#03110D] flex">
      <Sidebar onUploadClick={() => setIsUploadOpen(true)} />
      
      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 bg-[#071A15] h-full flex flex-col border-r border-[#173B30] animate-fade-in">
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#10B981]">
                <ImageIcon size={24} />
                <h1 className="text-lg font-bold text-white">ImageGallery</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#86A99A]">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#10B981] text-white rounded-xl">
                <ImageIcon size={20} /> Gallery
              </a>
              <button onClick={() => { setIsMobileMenuOpen(false); setIsUploadOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 text-[#B7D3C7]">
                <CloudUpload size={20} /> Upload
              </button>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 xl:ml-64 flex flex-col min-h-screen w-full">
        <Topbar 
          searchQuery={search} 
          setSearchQuery={setSearch} 
          onUploadClick={() => setIsUploadOpen(true)}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <HeroSection totalImages={images.length} onUpload={() => setIsUploadOpen(true)} />
          
          <CategoryFilters />
          
          <GalleryToolbar sort={sort} setSort={setSort} view={view} setView={setView} />

          {error && !loading && (
            <div className="bg-[#1F0909] border border-[#EF4444] rounded-2xl p-8 text-center my-8">
              <h3 className="text-xl font-bold text-white mb-2">Unable to load your gallery</h3>
              <p className="text-[#B7D3C7] mb-4">Something went wrong while loading your images.</p>
              <button onClick={() => window.location.reload()} className="bg-[#EF4444] text-white px-6 py-2 rounded-lg font-medium">Try Again</button>
            </div>
          )}

          {!error && (
            <>
              {loading ? (
                <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                  {[...Array(8)].map((_, i) => <ImageSkeleton key={i} view={view} />)}
                </div>
              ) : images.length === 0 ? (
                <EmptyGallery onUpload={() => setIsUploadOpen(true)} />
              ) : (
                <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20" : "flex flex-col gap-4 pb-20"}>
                  {images.map(img => (
                    <ImageCard 
                      key={img._id} 
                      image={img} 
                      view={view} 
                      onEdit={openEdit}
                      onDelete={openDelete}
                      onPreview={openPreview}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />
      
      <EditImageModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        image={selectedImage}
        onUpdate={handleUpdate}
      />
      
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        image={selectedImage}
        onDelete={handleDelete}
      />

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        image={selectedImage}
        onEdit={() => { setIsPreviewOpen(false); openEdit(selectedImage!); }}
        onDelete={() => { setIsPreviewOpen(false); openDelete(selectedImage!); }}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
  `
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
}

console.log('All frontend UI components successfully created!');
