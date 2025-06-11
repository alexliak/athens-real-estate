// Favorites Manager - Local Storage Implementation

export interface FavoriteProperty {
  id: number;
  timestamp: string;
}

class FavoritesManager {
  private storageKey = 'real-estate-athens-favorites';

  // Get all favorites from localStorage
  getFavorites(): number[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const favorites: FavoriteProperty[] = JSON.parse(stored);
      return favorites.map(f => f.id);
    } catch (error) {
      console.error('Error reading favorites:', error);
      return [];
    }
  }

  // Check if a property is favorited
  isFavorite(propertyId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(propertyId);
  }

  // Toggle favorite status
  toggleFavorite(propertyId: number): boolean {
    if (this.isFavorite(propertyId)) {
      this.removeFavorite(propertyId);
      return false;
    } else {
      this.addFavorite(propertyId);
      return true;
    }
  }

  // Add to favorites
  private addFavorite(propertyId: number): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const favorites: FavoriteProperty[] = stored ? JSON.parse(stored) : [];
      
      // Check if already exists
      if (favorites.some(f => f.id === propertyId)) return;
      
      // Add new favorite
      favorites.push({
        id: propertyId,
        timestamp: new Date().toISOString()
      });
      
      // Save back to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('favoritesChanged', { 
        detail: { propertyId, action: 'add' } 
      }));
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  // Remove from favorites
  private removeFavorite(propertyId: number): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return;
      
      const favorites: FavoriteProperty[] = JSON.parse(stored);
      const filtered = favorites.filter(f => f.id !== propertyId);
      
      // Save updated list
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('favoritesChanged', { 
        detail: { propertyId, action: 'remove' } 
      }));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  // Clear all favorites
  clearFavorites(): void {
    try {
      localStorage.removeItem(this.storageKey);
      window.dispatchEvent(new CustomEvent('favoritesChanged', { 
        detail: { action: 'clear' } 
      }));
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }

  // Get favorites count
  getCount(): number {
    return this.getFavorites().length;
  }

  // Get favorites with timestamp info
  getFavoritesWithDetails(): FavoriteProperty[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error reading favorites details:', error);
      return [];
    }
  }
}

// Export singleton instance
export const favoritesManager = new FavoritesManager();