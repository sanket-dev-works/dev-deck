'use client';

import Link from 'next/link';
import { Tool } from '@/types/tool';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getIcon } from '@/lib/utils/icons';

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = getIcon(tool.icon);

  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="h-full hover:border-foreground/20 transition-colors cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2 group-hover:bg-primary/10 transition-colors">
              <Icon className="h-5 w-5 text-foreground" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold leading-tight">{tool.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5 line-clamp-1">{tool.shortDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
