import { useState, useEffect } from 'react';

export interface Album {
  id: string;
  name: string;
  description?: string;
  imageIds: string[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'image-gallery-albums';

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadAlbums = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setAlbums(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load albums', err);
      }
      setIsLoaded(true);
    };

    loadAlbums();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadAlbums();
      }
    };

    const handleCustomEvent = () => {
      loadAlbums();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('albums-updated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('albums-updated', handleCustomEvent);
    };
  }, []);

  const saveAlbums = (newAlbums: Album[]) => {
    setAlbums(newAlbums);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAlbums));
    window.dispatchEvent(new Event('albums-updated'));
  };

  const createAlbum = (name: string, description: string = '') => {
    const newAlbum: Album = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      imageIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAlbums([...albums, newAlbum]);
    return newAlbum;
  };

  const updateAlbum = (id: string, name: string, description: string = '') => {
    const newAlbums = albums.map(album => 
      album.id === id 
        ? { ...album, name: name.trim(), description: description.trim(), updatedAt: new Date().toISOString() } 
        : album
    );
    saveAlbums(newAlbums);
  };

  const deleteAlbum = (id: string) => {
    saveAlbums(albums.filter(album => album.id !== id));
  };

  const addImagesToAlbum = (albumId: string, newImageIds: string[]) => {
    const newAlbums = albums.map(album => {
      if (album.id === albumId) {
        const uniqueIds = Array.from(new Set([...album.imageIds, ...newImageIds]));
        return { ...album, imageIds: uniqueIds, updatedAt: new Date().toISOString() };
      }
      return album;
    });
    saveAlbums(newAlbums);
  };

  const removeImageFromAlbum = (albumId: string, imageId: string) => {
    const newAlbums = albums.map(album => {
      if (album.id === albumId) {
        return { 
          ...album, 
          imageIds: album.imageIds.filter(id => id !== imageId), 
          updatedAt: new Date().toISOString() 
        };
      }
      return album;
    });
    saveAlbums(newAlbums);
  };

  const cleanupDeletedImage = (imageId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let currentAlbums: Album[] = JSON.parse(stored);
        let changed = false;
        const newAlbums = currentAlbums.map(album => {
          if (album.imageIds.includes(imageId)) {
            changed = true;
            return {
              ...album,
              imageIds: album.imageIds.filter(id => id !== imageId),
              updatedAt: new Date().toISOString()
            };
          }
          return album;
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newAlbums));
          window.dispatchEvent(new Event('albums-updated'));
        }
      }
    } catch (err) {
      console.error('Failed to cleanup deleted image from albums', err);
    }
  };

  return {
    albums,
    isLoaded,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addImagesToAlbum,
    removeImageFromAlbum,
    cleanupDeletedImage
  };
}
