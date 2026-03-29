'use client';

import { useId } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface ToolInputProps extends React.ComponentProps<typeof Textarea> {
  label: string;
  labelClassName?: string;
}

export function ToolInput({
  label,
  id,
  className,
  labelClassName,
  ...props
}: ToolInputProps) {
  const uid = useId();
  const inputId = id ?? `tool-input-${uid}`;

  return (
    <div className="space-y-2">
      <Label
        htmlFor={inputId}
        className={cn('text-sm font-medium text-muted-foreground', labelClassName)}
      >
        {label}
      </Label>
      <Textarea
        id={inputId}
        className={cn('min-h-[200px] font-mono text-sm', className)}
        {...props}
      />
    </div>
  );
}
