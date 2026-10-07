"use client";

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import Toast, { ToastType } from '../../components/common/Toast';
import { useAlbums, Album } from '../../hooks/useAlbums';
import { useSettings } from '../../hooks/useSettings';
import { useImages } from '../../hooks/useImages';
import { Layers, Plus, Edit2, Trash2, Folder, X } from 'lucide-react';
import AlbumModal from '../../components/albums/AlbumModal';
import DeleteAlbumConfirmModal from '../../components/albums/DeleteAlbumConfirmModal';
import UploadModal from '../../components/upload/UploadModal';
import { formatDate } from '../../utils/format';

export default function AlbumsPage() {
  const { albums, createAlbum, updateAlbum, deleteAlbum, isLoaded } = useAlbums();
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const { search, setSearch, uploadImage } = useImages();

  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);

  const showToast = (message: string, type: ToastType) => {
    if (!settingsLoaded || settings.notifications) {
      setToast({ message, type });
    }
  };

  const handleUpload = async (title: string, file: File) => {
    try {
      await uploadImage(title, file);
      showToast('Image uploaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload image', 'error');
      throw err;
    }
  };

  const openCreateModal = () => {
    setSelectedAlbum(null);
    setIsAlbumModalOpen(true);
  };

  const openEditModal = (album: Album) => {
    setSelectedAlbum(album);
    setIsAlbumModalOpen(true);
  };

  const openDeleteModal = (album: Album) => {
    if (settingsLoaded && !settings.confirmDelete) {
      handleDeleteAlbum(album.id);
    } else {
      setSelectedAlbum(album);
      setIsDeleteModalOpen(true);
    }
  };

  const handleSaveAlbum = (name: string, description: string) => {
    if (selectedAlbum) {
      updateAlbum(selectedAlbum.id, name, description);
      showToast('Album updated successfully', 'success');
    } else {
      createAlbum(name, description);
      showToast('Album created successfully', 'success');
    }
  };

  const handleDeleteAlbum = (id: string) => {
    deleteAlbum(id);
    showToast('Album deleted successfully', 'success');
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-brand-bgMain flex">
      <Sidebar onUploadClick={() => setIsUploadOpen(true)} />
      
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 bg-brand-bgSecondary h-full flex flex-col border-r border-brand-border animate-fade-in">
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#10B981]">
                <Layers size={24} />
                <h1 className="text-lg font-bold text-brand-textMain">Albums</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-brand-textMuted">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-brand-textSecondary hover:bg-brand-bgCard hover:text-brand-textMain rounded-xl transition-colors">
                Gallery
              </Link>
              <Link href="/albums" className="flex items-center gap-3 px-4 py-3 bg-[#10B981] text-white rounded-xl">
                Albums
              </Link>
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
        
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-brand-textMain mb-2 flex items-center gap-3">
                <Layers className="text-[#10B981]" size={32} />
                Your Albums
              </h1>
              <p className="text-brand-textSecondary">Organize your images into collections.</p>
            </div>
            <button 
              onClick={openCreateModal}
              className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-[#10B981]/20"
            >
              <Plus size={18} /> Create Album
            </button>
          </div>

          {albums.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-brand-bgSecondary border-2 border-dashed border-brand-border rounded-full flex items-center justify-center mb-6 text-[#10B981]">
                <Folder size={48} />
              </div>
              <h3 className="text-2xl font-bold text-brand-textMain mb-3">No albums yet</h3>
              <p className="text-brand-textSecondary max-w-md mb-8">
                Create your first album to organize your images.
              </p>
              <button 
                onClick={openCreateModal}
                className="bg-[#10B981] hover:bg-[#0EA5E9] text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Create Album
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {albums.map(album => (
                <div key={album.id} className="bg-brand-bgCard border border-brand-border rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] hover:border-[#10B981]/50 transition-all duration-300 flex flex-col">
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-12 h-12 bg-brand-bgSecondary rounded-xl flex items-center justify-center text-[#10B981]">
                        <Folder size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditModal(album)} className="p-2 rounded-full hover:bg-brand-bgSecondary text-brand-textMuted hover:text-[#10B981] transition-colors" aria-label="Edit album">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => openDeleteModal(album)} className="p-2 rounded-full hover:bg-brand-bgSecondary text-brand-textMuted hover:text-[#EF4444] transition-colors" aria-label="Delete album">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-brand-textMain mb-1 truncate" title={album.name}>{album.name}</h3>
                    {album.description && (
                      <p className="text-brand-textMuted text-sm line-clamp-2 mb-3 flex-1">{album.description}</p>
                    )}
                    
                    <div className="mt-auto pt-4 border-t border-brand-border flex items-center justify-between">
                      <span className="text-brand-textMuted text-xs font-medium">
                        {album.imageIds.length} {album.imageIds.length === 1 ? 'image' : 'images'}
                      </span>
                      <span className="text-brand-textMuted text-xs font-medium">
                        Created {formatDate(album.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <Link href={`/albums/${album.id}`} className="block w-full text-center bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white py-3 font-medium transition-colors">
                    Open Album
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AlbumModal 
        isOpen={isAlbumModalOpen} 
        onClose={() => setIsAlbumModalOpen(false)} 
        onSave={handleSaveAlbum} 
        album={selectedAlbum} 
      />
      
      <DeleteAlbumConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onDelete={handleDeleteAlbum} 
        album={selectedAlbum} 
      />

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
