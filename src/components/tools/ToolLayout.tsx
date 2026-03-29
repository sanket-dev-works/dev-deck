'use client';

import { useEffect } from 'react';
import { Tool } from '@/types/tool';
import { ToolHeader } from './ToolHeader';
import { RelatedTools } from './RelatedTools';
import { addRecentTool } from '@/lib/storage/recentTools';

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  useEffect(() => {
    addRecentTool(tool.slug);
  }, [tool.slug]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <ToolHeader tool={tool} />
      <section aria-label="Tool workspace" className="space-y-4">
        {children}
      </section>
      <RelatedTools currentTool={tool} />
    </div>
  );
}
