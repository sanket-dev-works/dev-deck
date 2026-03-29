import Link from 'next/link';
import { Tool } from '@/types/tool';
import { tools } from '@/config/tools';
import { getIcon } from '@/lib/utils/icons';
import { Card, CardContent } from '@/components/ui/card';

export function RelatedTools({ currentTool }: { currentTool: Tool }) {
  const related = tools
    .filter((t) => t.category === currentTool.category && t.slug !== currentTool.slug)
    .slice(0, 4);

  if (related.length === 0) {
    const others = tools.filter((t) => t.slug !== currentTool.slug).slice(0, 4);
    if (others.length === 0) return null;
    return <RelatedGrid tools={others} />;
  }

  return <RelatedGrid tools={related} />;
}

function RelatedGrid({ tools: relatedTools }: { tools: Tool[] }) {
  return (
    <div className="mt-8 pt-8 border-t border-border">
      <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {relatedTools.map((tool) => {
          const Icon = getIcon(tool.icon);
          return (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full" size="sm">
                <CardContent>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{tool.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tool.shortDescription}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
