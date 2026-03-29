'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchTools } from '@/config/tools';

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => (query.trim() ? searchTools(query) : []),
    [query]
  );

  const showPanel = panelOpen && query.trim().length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function navigateToTool(slug: string) {
    setQuery('');
    setPanelOpen(false);
    router.push(`/tools/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showPanel || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      navigateToTool(results[selectedIndex].slug);
    } else if (e.key === 'Escape') {
      setPanelOpen(false);
    }
  }

  return (
    <div ref={ref} className={`relative ${className || ''}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            setSelectedIndex(0);
            setPanelOpen(v.trim().length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim()) setPanelOpen(true);
          }}
          className="h-9 pl-9"
        />
      </div>
      {showPanel && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {results.map((tool, i) => (
            <button
              key={tool.slug}
              type="button"
              onClick={() => navigateToTool(tool.slug)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                i === selectedIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'text-popover-foreground hover:bg-accent/50'
              }`}
            >
              <span className="font-medium">{tool.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{tool.shortDescription}</span>
            </button>
          ))}
        </div>
      )}
      {showPanel && results.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-border bg-popover p-4 text-center text-sm text-muted-foreground shadow-lg">
          No tools found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
