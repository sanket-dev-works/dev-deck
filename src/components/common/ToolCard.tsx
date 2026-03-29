'use client';

import { createElement } from 'react';
import Link from 'next/link';
import { Tool } from '@/types/tool';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getIcon } from '@/lib/utils/icons';

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = getIcon(tool.icon);

  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="h-full cursor-pointer border-border/70 bg-card/70 backdrop-blur-sm transition-all duration-200 hover:border-brand/35 hover:shadow-[0_8px_30px_-12px_oklch(0.55_0.14_200_/_25%)] dark:hover:shadow-[0_8px_30px_-12px_oklch(0.78_0.12_195_/_18%)] group dark:bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border/50 bg-muted/80 p-2.5 shadow-inner transition-colors duration-200 group-hover:border-brand/30 group-hover:bg-brand-muted/80 dark:group-hover:bg-brand-muted/40">
              {createElement(Icon, {
                className:
                  'h-5 w-5 text-foreground transition-colors group-hover:text-brand',
              })}
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold leading-tight tracking-tight transition-colors group-hover:text-foreground">
                {tool.name}
              </CardTitle>
              <CardDescription className="mt-0.5 line-clamp-1 text-xs">{tool.shortDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
