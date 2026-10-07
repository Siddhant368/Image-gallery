import { useState, useEffect } from 'react';

const STORAGE_KEY = 'image-gallery-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load favorites', err);
      }
    };

    loadFavorites();

    // Listen for cross-tab or cross-component changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadFavorites();
      }
    };

    const handleCustomEvent = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favorites-updated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favorites-updated', handleCustomEvent);
    };
  }, []);

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event('favorites-updated'));
  };

  const toggleFavorite = (id: string) => {
    const isFav = favorites.includes(id);
    const newFavorites = isFav 
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    saveFavorites(newFavorites);
  };

  const removeFavorite = (id: string) => {
    if (favorites.includes(id)) {
      saveFavorites(favorites.filter(favId => favId !== id));
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return {
    favorites,
    toggleFavorite,
    removeFavorite,
    isFavorite,
  };
}
