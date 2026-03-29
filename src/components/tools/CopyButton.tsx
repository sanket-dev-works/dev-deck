'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/utils/clipboard';

interface CopyButtonProps {
  text: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
  className?: string;
  label?: string;
}

export function CopyButton({ text, variant = 'ghost', size = 'sm', className, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
      disabled={!text}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          {label && <span className="ml-1.5">Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label && <span className="ml-1.5">{label}</span>}
        </>
      )}
    </Button>
  );
}
