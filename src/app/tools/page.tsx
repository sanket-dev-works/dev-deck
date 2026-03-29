'use client';

import { useState } from 'react';
import { tools } from '@/config/tools';
import { categories } from '@/config/categories';
import { ToolCard } from '@/components/common/ToolCard';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ToolsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filteredTools = activeCategory === 'all'
    ? tools
    : tools.filter((t) => t.category === activeCategory);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <p className="mb-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Library
      </p>
      <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">All tools</h1>
      <p className="mb-8 max-w-xl text-muted-foreground leading-relaxed">
        Browse every utility in DevDeck — <span className="text-foreground/85 font-mono text-sm">{tools.length}</span>{' '}
        tools, same privacy: runs in your browser only.
      </p>

      <div className="mb-10 flex flex-wrap gap-2">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          className={
            activeCategory === 'all'
              ? 'shadow-sm'
              : 'border-border/70 bg-background/60 backdrop-blur-sm hover:border-brand/35 dark:bg-card/50'
          }
          onClick={() => setActiveCategory('all')}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.slug}
            variant={activeCategory === cat.slug ? 'default' : 'outline'}
            size="sm"
            className={
              activeCategory === cat.slug
                ? 'shadow-sm'
                : 'border-border/70 bg-background/60 backdrop-blur-sm hover:border-brand/35 dark:bg-card/50'
            }
            onClick={() => setActiveCategory(cat.slug)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 py-14 text-center text-muted-foreground backdrop-blur-sm dark:bg-muted/10">
          No tools in this category.
        </div>
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-6xl px-4 py-8">Loading...</div>}>
      <ToolsContent />
    </Suspense>
  );
}
