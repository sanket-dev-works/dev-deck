'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isFavorite, toggleFavorite } from '@/lib/storage/favorites';

export function FavoriteButton({ slug }: { slug: string }) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(slug));
  }, [slug]);

  function handleToggle() {
    toggleFavorite(slug);
    setFavorited(!favorited);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="h-8 w-8"
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`h-4 w-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
    </Button>
  );
}
