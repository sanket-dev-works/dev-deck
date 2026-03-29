'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { tools } from '@/config/tools';
import { categories } from '@/config/categories';
import { getIcon } from '@/lib/utils/icons';
import { getRecentTools } from '@/lib/storage/recentTools';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const recentSlugs = useMemo(() => (open ? getRecentTools() : []), [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  function navigateTo(path: string) {
    setOpen(false);
    router.push(path);
  }

  const recentTools = recentSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search Tools"
      description="Search for a developer tool to use"
    >
      <Command>
        <CommandInput placeholder="Search tools..." />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>

          {recentTools.length > 0 && (
            <CommandGroup heading="Recent">
              {recentTools.map((tool) => {
                if (!tool) return null;
                const Icon = getIcon(tool.icon);
                return (
                  <CommandItem
                    key={tool.slug}
                    onSelect={() => navigateTo(`/tools/${tool.slug}`)}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{tool.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {tool.shortDescription}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {categories.map((cat) => {
            const categoryTools = tools.filter((t) => t.category === cat.slug);
            if (categoryTools.length === 0) return null;
            return (
              <CommandGroup key={cat.slug} heading={cat.name}>
                {categoryTools.map((tool) => {
                  const Icon = getIcon(tool.icon);
                  return (
                    <CommandItem
                      key={tool.slug}
                      onSelect={() => navigateTo(`/tools/${tool.slug}`)}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{tool.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {tool.shortDescription}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
