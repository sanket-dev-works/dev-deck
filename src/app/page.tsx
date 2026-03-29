'use client';

import { useState, useEffect, useMemo, startTransition, type ReactNode } from 'react';
import Link from 'next/link';
import { Search, Terminal, ArrowRight, Clock, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { getIcon } from '@/lib/utils/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToolCard } from '@/components/common/ToolCard';
import { tools, searchTools, getPopularTools } from '@/config/tools';
import { categories } from '@/config/categories';
import { getRecentTools } from '@/lib/storage/recentTools';
import { getFavorites } from '@/lib/storage/favorites';
import { Tool } from '@/types/tool';
import { useRouter } from 'next/navigation';

const CATEGORY_ACCENTS: Record<string, { gradient: string; icon: string }> = {
  'data-tools': {
    gradient: 'from-emerald-500/90 via-emerald-500/40 to-transparent',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  'auth-security': {
    gradient: 'from-amber-500/90 via-amber-500/40 to-transparent',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  'text-string': {
    gradient: 'from-sky-500/90 via-sky-500/40 to-transparent',
    icon: 'text-sky-600 dark:text-sky-400',
  },
  'date-time': {
    gradient: 'from-violet-500/90 via-violet-500/40 to-transparent',
    icon: 'text-violet-600 dark:text-violet-400',
  },
  'code-tools': {
    gradient: 'from-fuchsia-500/90 via-fuchsia-500/40 to-transparent',
    icon: 'text-fuchsia-600 dark:text-fuchsia-400',
  },
  generators: {
    gradient: 'from-cyan-500/90 via-cyan-500/40 to-transparent',
    icon: 'text-cyan-600 dark:text-cyan-400',
  },
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const router = useRouter();

  const searchResults = useMemo(
    () => (query.trim() ? searchTools(query) : []),
    [query]
  );

  useEffect(() => {
    startTransition(() => {
      setRecentSlugs(getRecentTools());
      setFavoriteSlugs(getFavorites());
    });
  }, []);

  const recentTools = recentSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  const favoriteTools = favoriteSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  const popularTools = getPopularTools();

  return (
    <div className="container mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="relative py-16 text-center md:py-24">
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm dark:bg-muted/25">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          <span className="font-mono tracking-tight">Browser-local · No accounts</span>
        </div>

        <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-2xl bg-brand/15 blur-2xl dark:bg-brand/20"
              aria-hidden
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/90 to-muted/50 shadow-lg dark:from-brand-muted/50 dark:to-card/80">
              <Terminal className="h-8 w-8 text-brand" strokeWidth={2} />
            </div>
          </div>
          <div className="text-left sm:text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl md:leading-[1.05]">
              <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/65 bg-clip-text text-transparent dark:from-white dark:via-foreground dark:to-muted-foreground">
                DevDeck
              </span>
            </h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground md:text-base">
              Your utility dock for everyday dev work
            </p>
          </div>
        </div>

        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Fast, focused tools — JSON, JWT, regex, hashes, and more.{' '}
          <span className="text-foreground/90">Everything runs client-side</span>; nothing leaves your machine.
        </p>

        <div className="relative mx-auto max-w-xl">
          <div
            className="pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-brand/20 via-transparent to-brand/20 opacity-60 blur-md dark:from-brand/30 dark:to-brand/25"
            aria-hidden
          />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tools… json, jwt, timestamp, base64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 border-border/80 bg-background/80 pl-12 text-base shadow-sm backdrop-blur-sm transition-shadow focus-visible:border-brand/50 focus-visible:ring-brand/20 dark:bg-card/60"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <Badge
            variant="secondary"
            className="gap-1.5 border border-border/50 bg-muted/50 font-normal backdrop-blur-sm dark:bg-muted/30"
          >
            <kbd className="pointer-events-none inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground shadow-sm">
              &#8984;K
            </kbd>
            quick search
          </Badge>
          <Badge
            variant="secondary"
            className="border border-border/50 bg-muted/50 font-mono font-normal backdrop-blur-sm dark:bg-muted/30"
          >
            {tools.length} tools
          </Badge>
        </div>
      </section>

      {/* Search Results */}
      {query.trim() && (
        <section className="pb-14">
          <SectionLabel>Search</SectionLabel>
          <h2 className="mb-6 text-xl font-semibold tracking-tight md:text-2xl">
            {searchResults.length > 0
              ? `${searchResults.length} result${searchResults.length > 1 ? 's' : ''} for “${query}”`
              : `No results for “${query}”`}
          </h2>
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Popular tools */}
      {!query.trim() && popularTools.length > 0 && (
        <section className="pb-14">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-brand dark:bg-muted/25">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div className="text-left">
              <SectionLabel>Staff picks</SectionLabel>
              <h2 className="text-xl font-semibold tracking-tight">Popular tools</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Tools */}
      {!query.trim() && recentTools.length > 0 && (
        <section className="pb-14">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground dark:bg-muted/25">
              <Clock className="h-4 w-4" />
            </span>
            <div className="text-left">
              <SectionLabel>Pick up where you left off</SectionLabel>
              <h2 className="text-xl font-semibold tracking-tight">Recently used</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Favorite Tools */}
      {!query.trim() && favoriteTools.length > 0 && (
        <section className="pb-14">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-brand dark:bg-muted/25">
              <Heart className="h-4 w-4 fill-brand/15" />
            </span>
            <div className="text-left">
              <SectionLabel>Shortcuts</SectionLabel>
              <h2 className="text-xl font-semibold tracking-tight">Favorites</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {!query.trim() && (
        <section className="pb-14">
          <div className="mb-6 text-left">
            <SectionLabel>Browse</SectionLabel>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Categories</h2>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">
              Jump into a topic — each category groups related utilities.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const Icon = getIcon(cat.icon);
              const count = tools.filter((t) => t.category === cat.slug).length;
              const accent = CATEGORY_ACCENTS[cat.slug] ?? {
                gradient: 'from-brand/80 via-brand/30 to-transparent',
                icon: 'text-brand',
              };
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => router.push(`/tools?category=${cat.slug}`)}
                  className="group text-left"
                >
                  <Card className="h-full overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-lg hover:shadow-black/5 dark:bg-card/45 dark:hover:shadow-black/25">
                    <div
                      className={`h-1 bg-gradient-to-r ${accent.gradient}`}
                      aria-hidden
                    />
                    <CardHeader className="p-4 pt-3">
                      <Icon
                        className={`mb-2 h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${accent.icon}`}
                      />
                      <CardTitle className="text-xs font-semibold leading-snug tracking-tight">
                        {cat.name}
                      </CardTitle>
                      <CardDescription className="font-mono text-[11px] text-muted-foreground">
                        {count} tool{count !== 1 ? 's' : ''}
                      </CardDescription>
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
        <section className="pb-20">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>Library</SectionLabel>
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">All tools</h2>
            </div>
            <Link href="/tools">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-border/70 bg-background/50 font-medium backdrop-blur-sm hover:border-brand/40 hover:bg-brand-muted/30 dark:bg-card/40"
              >
                View full list
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
