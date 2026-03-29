/**
 * Local persistence for DevDeck (recent tools, favorites).
 * All reads/writes use localStorage and are safe to call from client components only.
 */
export {
  getRecentTools,
  addRecentTool,
} from '@/lib/storage/recentTools';

export {
  getFavorites,
  toggleFavorite,
  isFavorite,
} from '@/lib/storage/favorites';
