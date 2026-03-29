'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchTools } from '@/config/tools';
import { Tool } from '@/types/tool';

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      setResults(searchTools(query));
      setOpen(true);
      setSelectedIndex(0);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function navigateToTool(slug: string) {
    setQuery('');
    setOpen(false);
    router.push(`/tools/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
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
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className={`relative ${className || ''}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setOpen(true)}
          className="pl-9 h-9"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map((tool, i) => (
            <button
              key={tool.slug}
              onClick={() => navigateToTool(tool.slug)}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                i === selectedIndex ? 'bg-accent text-accent-foreground' : 'text-popover-foreground hover:bg-accent/50'
              }`}
            >
              <span className="font-medium">{tool.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">{tool.shortDescription}</span>
            </button>
          ))}
        </div>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
          No tools found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
