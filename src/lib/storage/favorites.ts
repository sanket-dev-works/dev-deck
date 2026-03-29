const FAVORITES_KEY = 'devdeck-favorites';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(slug: string): string[] {
  const favorites = getFavorites();
  const index = favorites.indexOf(slug);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(slug);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}
