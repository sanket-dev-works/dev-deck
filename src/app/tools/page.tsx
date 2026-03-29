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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-2">All Tools</h1>
      <p className="text-muted-foreground mb-6">Browse all {tools.length} developer utilities.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory('all')}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.slug}
            variant={activeCategory === cat.slug ? 'default' : 'outline'}
            size="sm"
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
        <div className="text-center py-12 text-muted-foreground">
          No tools found in this category.
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
