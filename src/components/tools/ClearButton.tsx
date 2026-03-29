'use client';

import { Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClearButtonProps {
  onClear: () => void;
  disabled?: boolean;
  label?: string;
}

export function ClearButton({
  onClear,
  disabled,
  label = 'Clear',
}: ClearButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClear}
      disabled={disabled}
      className="gap-1.5"
    >
      <Eraser className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
