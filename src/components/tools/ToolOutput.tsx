'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/tools/CopyButton';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ToolOutputProps {
  label: string;
  value: string;
  emptyHint?: string;
  minHeightClassName?: string;
  copyLabel?: string;
  monospace?: boolean;
  className?: string;
}

export function ToolOutput({
  label,
  value,
  emptyHint = 'Output will appear here…',
  minHeightClassName = 'min-h-[200px]',
  copyLabel = 'Copy',
  monospace = true,
  className,
}: ToolOutputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
        <CopyButton text={value} label={copyLabel} size="sm" variant="ghost" />
      </div>
      <Card className={cn(minHeightClassName)}>
        <CardContent className="pt-6">
          <pre
            className={cn(
              'whitespace-pre-wrap break-all text-sm text-foreground',
              monospace && 'font-mono'
            )}
          >
            {value || <span className="text-muted-foreground">{emptyHint}</span>}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
