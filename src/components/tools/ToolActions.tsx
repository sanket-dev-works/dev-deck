'use client';

import { cn } from '@/lib/utils';

interface ToolActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolActions({ children, className }: ToolActionsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>{children}</div>
  );
}
