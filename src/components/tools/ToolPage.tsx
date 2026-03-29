'use client';

import { createElement } from 'react';
import { Tool } from '@/types/tool';
import { ToolLayout } from './ToolLayout';
import { getToolComponent } from '@/config/toolRegistry';

export function ToolPage({ tool }: { tool: Tool }) {
  const ToolComponent = getToolComponent(tool.slug);

  if (!ToolComponent) {
    return (
      <ToolLayout tool={tool}>
        <div className="py-12 text-center text-muted-foreground">
          This tool is coming soon.
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout tool={tool}>{createElement(ToolComponent)}</ToolLayout>
  );
}
