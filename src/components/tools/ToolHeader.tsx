import { Tool } from '@/types/tool';
import { PrivacyBadge } from './PrivacyBadge';
import { FavoriteButton } from './FavoriteButton';

export function ToolHeader({ tool }: { tool: Tool }) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{tool.name}</h1>
          <p className="text-muted-foreground mt-1">{tool.description}</p>
        </div>
        <FavoriteButton slug={tool.slug} />
      </div>
      <div className="mt-3">
        <PrivacyBadge />
      </div>
    </div>
  );
}
