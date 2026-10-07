"use client";

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import GalleryToolbar from '../../components/gallery/GalleryToolbar';
import ImageCard from '../../components/gallery/ImageCard';
import ImageSkeleton from '../../components/gallery/ImageSkeleton';
import UploadModal from '../../components/upload/UploadModal';
import EditImageModal from '../../components/edit/EditImageModal';
import DeleteConfirmModal from '../../components/delete/DeleteConfirmModal';
import ImagePreviewModal from '../../components/gallery/ImagePreviewModal';
import Toast, { ToastType } from '../../components/common/Toast';
import { useImages } from '../../hooks/useImages';
import { useFavorites } from '../../hooks/useFavorites';
import { useAlbums } from '../../hooks/useAlbums';
import { useSettings } from '../../hooks/useSettings';
import { ImageItem } from '../../types/image';
import { X, Image as ImageIcon, CloudUpload, Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { 
    images, loading, error, 
    search, setSearch, sort, setSort, 
    uploadImage, updateImage, deleteImage 
  } = useImages();
  
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites();
  const { cleanupDeletedImage } = useAlbums();
  const { settings, updateSettings, isLoaded: settingsLoaded } = useSettings();

  const view = settingsLoaded ? settings.galleryView : 'grid';
  const setView = (newView: 'grid' | 'list') => updateSettings({ galleryView: newView });
  
  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  
  // Toast state
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);

  const showToast = (message: string, type: ToastType) => {
    if (settings.notifications) {
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
      removeFavorite(id);
      cleanupDeletedImage(id);
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
    if (settingsLoaded && !settings.confirmDelete) {
      handleDelete(img._id);
    } else {
      setSelectedImage(img);
      setIsDeleteOpen(true);
    }
  };

  const openPreview = (img: ImageItem) => {
    setSelectedImage(img);
    setIsPreviewOpen(true);
  };

  const favoriteImages = images.filter(img => isFavorite(img._id));

  return (
    <div className="min-h-screen bg-brand-bgMain flex">
      <Sidebar onUploadClick={() => setIsUploadOpen(true)} />
      
      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 bg-brand-bgSecondary h-full flex flex-col border-r border-brand-border animate-fade-in">
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#10B981]">
                <ImageIcon size={24} />
                <h1 className="text-lg font-bold text-brand-textMain">ImageGallery</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-brand-textMuted">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-brand-textSecondary hover:bg-brand-bgCard hover:text-brand-textMain rounded-xl transition-colors font-medium">
                <ImageIcon size={20} /> Gallery
              </Link>
              <Link href="/favorites" className="flex items-center gap-3 px-4 py-3 bg-[#10B981] text-white rounded-xl">
                <Heart size={20} /> Favorites
              </Link>
              <button onClick={() => { setIsMobileMenuOpen(false); setIsUploadOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 text-brand-textSecondary">
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-textMain mb-2 flex items-center gap-3">
              <Heart className="text-[#10B981]" size={32} />
              Your Favorites
            </h1>
            <p className="text-brand-textSecondary">Images you have liked will appear here.</p>
          </div>
          
          <GalleryToolbar sort={sort} setSort={setSort} view={view} setView={setView} />

          {error && !loading && (
            <div className="bg-brand-bgError border border-[#EF4444] rounded-2xl p-8 text-center my-8">
              <h3 className="text-xl font-bold text-brand-textMain mb-2">Unable to load your gallery</h3>
              <p className="text-brand-textSecondary mb-4">Something went wrong while loading your images.</p>
              <button onClick={() => window.location.reload()} className="bg-[#EF4444] text-white px-6 py-2 rounded-lg font-medium">Try Again</button>
            </div>
          )}

          {!error && (
            <>
              {loading ? (
                <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                  {[...Array(4)].map((_, i) => <ImageSkeleton key={i} view={view} />)}
                </div>
              ) : favoriteImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 bg-brand-bgSecondary border-2 border-dashed border-brand-border rounded-full flex items-center justify-center mb-6 text-[#10B981]">
                    <Heart size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-textMain mb-3">No favorite images yet</h3>
                  <p className="text-brand-textSecondary max-w-md">
                    You haven't added any images to your favorites. Go back to the gallery and click the heart icon on images you like.
                  </p>
                  <Link href="/" className="mt-8 bg-[#10B981] hover:bg-[#0EA5E9] text-white px-6 py-3 rounded-xl font-medium transition-colors">
                    Browse Gallery
                  </Link>
                </div>
              ) : (
                <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20" : "flex flex-col gap-4 pb-20"}>
                  {favoriteImages.map(img => (
                    <ImageCard 
                      key={img._id} 
                      image={img} 
                      view={view} 
                      onEdit={openEdit}
                      onDelete={openDelete}
                      onPreview={openPreview}
                      isFavorite={isFavorite(img._id)}
                      onToggleFavorite={() => {
                        toggleFavorite(img._id);
                        showToast(
                          isFavorite(img._id) ? 'Removed from favorites' : 'Added to favorites',
                          'success'
                        );
                      }}
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
