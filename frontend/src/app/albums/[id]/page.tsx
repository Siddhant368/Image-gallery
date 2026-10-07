"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../components/layout/Sidebar';
import Topbar from '../../../components/layout/Topbar';
import GalleryToolbar from '../../../components/gallery/GalleryToolbar';
import ImageCard from '../../../components/gallery/ImageCard';
import ImageSkeleton from '../../../components/gallery/ImageSkeleton';
import Toast, { ToastType } from '../../../components/common/Toast';
import { useAlbums, Album } from '../../../hooks/useAlbums';
import { useSettings } from '../../../hooks/useSettings';
import { useImages } from '../../../hooks/useImages';
import { useFavorites } from '../../../hooks/useFavorites';
import { ImageItem } from '../../../types/image';
import { Layers, Plus, ArrowLeft, X, Image as ImageIcon, CloudUpload, Edit2, Trash2 } from 'lucide-react';
import EditImageModal from '../../../components/edit/EditImageModal';
import DeleteConfirmModal from '../../../components/delete/DeleteConfirmModal';
import ImagePreviewModal from '../../../components/gallery/ImagePreviewModal';
import AddImagesModal from '../../../components/albums/AddImagesModal';
import UploadModal from '../../../components/upload/UploadModal';

export default function SingleAlbumPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;

  const { albums, addImagesToAlbum, removeImageFromAlbum, cleanupDeletedImage, isLoaded: albumsLoaded } = useAlbums();
  const { settings, updateSettings, isLoaded: settingsLoaded } = useSettings();
  const { images, loading, uploadImage, updateImage, deleteImage, search, setSearch, sort, setSort } = useImages();
  const { isFavorite, toggleFavorite, removeFavorite } = useFavorites();

  const [album, setAlbum] = useState<Album | null>(null);
  
  const view = settingsLoaded ? settings.galleryView : 'grid';
  const setView = (newView: 'grid' | 'list') => updateSettings({ galleryView: newView });
  
  const [isAddImagesOpen, setIsAddImagesOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);

  useEffect(() => {
    if (albumsLoaded) {
      const found = albums.find(a => a.id === albumId);
      if (found) {
        setAlbum(found);
      } else {
        router.push('/albums');
      }
    }
  }, [albums, albumId, albumsLoaded, router]);

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

  const handleRemoveFromAlbum = (img: ImageItem) => {
    if (album) {
      removeImageFromAlbum(album.id, img._id);
      showToast('Image removed from album', 'success');
    }
  };

  const handleAddImages = (imageIds: string[]) => {
    if (album) {
      addImagesToAlbum(album.id, imageIds);
      showToast('Images added to album', 'success');
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

  if (!albumsLoaded || !album) return null;

  const albumImages = images.filter(img => album.imageIds.includes(img._id));

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
          <Link href="/albums" className="inline-flex items-center gap-2 text-brand-textMuted hover:text-brand-textMain mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Albums
          </Link>
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-brand-textMain mb-2">{album.name}</h1>
              {album.description && (
                <p className="text-brand-textSecondary max-w-2xl">{album.description}</p>
              )}
              <p className="text-brand-textMuted text-sm mt-2">{album.imageIds.length} images</p>
            </div>
            <button 
              onClick={() => setIsAddImagesOpen(true)}
              className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-[#10B981]/20 whitespace-nowrap"
            >
              <Plus size={18} /> Add Images
            </button>
          </div>

          <GalleryToolbar sort={sort} setSort={setSort} view={view} setView={setView} />

          {loading ? (
            <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
              {[...Array(4)].map((_, i) => <ImageSkeleton key={i} view={view} />)}
            </div>
          ) : albumImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-brand-bgSecondary border-2 border-dashed border-brand-border rounded-full flex items-center justify-center mb-6 text-[#10B981]">
                <ImageIcon size={48} />
              </div>
              <h3 className="text-2xl font-bold text-brand-textMain mb-3">No images in this album</h3>
              <p className="text-brand-textSecondary max-w-md mb-8">
                This album is currently empty. Add some images from your gallery to get started.
              </p>
              <button 
                onClick={() => setIsAddImagesOpen(true)}
                className="bg-[#10B981] hover:bg-[#0EA5E9] text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Add Images
              </button>
            </div>
          ) : (
            <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20" : "flex flex-col gap-4 pb-20"}>
              {albumImages.map(img => (
                <ImageCard 
                  key={img._id} 
                  image={img} 
                  view={view} 
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onPreview={openPreview}
                  onRemoveFromAlbum={handleRemoveFromAlbum}
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
        </div>
      </main>

      <AddImagesModal 
        isOpen={isAddImagesOpen} 
        onClose={() => setIsAddImagesOpen(false)} 
        onSave={handleAddImages}
        allImages={images}
        existingImageIds={album.imageIds}
      />

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
        onRemoveFromAlbum={handleRemoveFromAlbum}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
