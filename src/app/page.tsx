'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Terminal, ArrowRight, Clock, Heart } from 'lucide-react';
import { getIcon } from '@/lib/utils/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToolCard } from '@/components/common/ToolCard';
import { tools, searchTools } from '@/config/tools';
import { categories } from '@/config/categories';
import { getRecentTools } from '@/lib/storage/recentTools';
import { getFavorites } from '@/lib/storage/favorites';
import { Tool } from '@/types/tool';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setRecentSlugs(getRecentTools());
    setFavoriteSlugs(getFavorites());
  }, []);

  useEffect(() => {
    if (query.trim()) {
      setSearchResults(searchTools(query));
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const recentTools = recentSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  const favoriteTools = favoriteSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  return (
    <div className="container mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Terminal className="h-10 w-10" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">DevDeck</h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Fast, clean developer utilities — all in one place. No ads, no clutter, everything runs in your browser.
        </p>
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search tools... (e.g. json, jwt, timestamp)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 text-base"
          />
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
          <Badge variant="secondary" className="gap-1 font-normal">
            <span className="font-mono">&#8984;K</span> to quick search
          </Badge>
          <Badge variant="secondary" className="gap-1 font-normal">
            {tools.length} tools available
          </Badge>
        </div>
      </section>

      {/* Search Results */}
      {query.trim() && (
        <section className="pb-12">
          <h2 className="text-lg font-semibold mb-4">
            {searchResults.length > 0
              ? `${searchResults.length} result${searchResults.length > 1 ? 's' : ''} for "${query}"`
              : `No results for "${query}"`}
          </h2>
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchResults.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recent Tools */}
      {!query.trim() && recentTools.length > 0 && (
        <section className="pb-12">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Recently Used</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentTools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Favorite Tools */}
      {!query.trim() && favoriteTools.length > 0 && (
        <section className="pb-12">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Favorites</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favoriteTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {!query.trim() && (
        <section className="pb-12">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const Icon = getIcon(cat.icon);
              const count = tools.filter((t) => t.category === cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  onClick={() => router.push(`/tools?category=${cat.slug}`)}
                  className="text-left"
                >
                  <Card className="hover:border-foreground/20 transition-colors cursor-pointer">
                    <CardHeader className="p-4">
                      <Icon className="h-5 w-5 mb-2 text-muted-foreground" />
                      <CardTitle className="text-xs font-medium">{cat.name}</CardTitle>
                      <CardDescription className="text-[11px]">{count} tool{count !== 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                  </Card>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* All Tools */}
      {!query.trim() && (
        <section className="pb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Tools</h2>
            <Link href="/tools">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
