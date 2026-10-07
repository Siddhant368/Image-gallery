import { useState, useCallback, useEffect } from 'react';
import { ImageItem } from '../types/image';
import { getImages, uploadImage as apiUpload, updateImageTitle, deleteImage as apiDelete } from '../lib/api';

export function useImages() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  
  const [totalPages, setTotalPages] = useState(1);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getImages(page, limit, search, sort);
      setImages(res.data);
      setTotalPages(res.pagination.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sort]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const uploadImage = async (title: string, file: File) => {
    const newImage = await apiUpload(title, file);
    // Reload first page or just insert at top
    if (page === 1 && sort === 'newest' && !search) {
      setImages(prev => [newImage, ...prev].slice(0, limit));
    } else {
      fetchImages(); // Refresh if on other pages
    }
    return newImage;
  };

  const updateImage = async (id: string, title: string) => {
    const updated = await updateImageTitle(id, title);
    setImages(prev => prev.map(img => img._id === id ? updated : img));
    return updated;
  };

  const deleteImage = async (id: string) => {
    await apiDelete(id);
    setImages(prev => prev.filter(img => img._id !== id));
    fetchImages(); // Refresh to fill empty spots
  };

  return {
    images,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    sort,
    setSort,
    totalPages,
    fetchImages,
    uploadImage,
    updateImage,
    deleteImage
  };
}
