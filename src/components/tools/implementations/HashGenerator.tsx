'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';

const SAMPLE_INPUT = 'Hello, DevDeck! Hash this string.';

const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!input) {
      setHashes({});
      return;
    }

    let cancelled = false;

    async function computeHashes() {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const results: Record<string, string> = {};

      for (const algo of ALGORITHMS) {
        try {
          const hashBuffer = await crypto.subtle.digest(algo, data);
          results[algo] = arrayBufferToHex(hashBuffer);
        } catch {
          results[algo] = 'Error computing hash';
        }
      }

      if (!cancelled) {
        setHashes(results);
      }
    }

    computeHashes();

    return () => {
      cancelled = true;
    };
  }, [input]);

  function handleSample() {
    setInput(SAMPLE_INPUT);
  }

  function handleClear() {
    setInput('');
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleSample} variant="outline" size="sm">
          Sample Data
        </Button>
        <Button onClick={handleClear} variant="ghost" size="sm">
          Clear
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Input</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="min-h-[100px] text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALGORITHMS.map((algo) => (
          <Card key={algo} size="sm">
            <CardContent>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">{algo}</span>
                <CopyButton text={hashes[algo] || ''} size="sm" variant="ghost" />
              </div>
              <p className="font-mono text-sm break-all text-foreground min-h-[1.5rem]">
                {hashes[algo] || (
                  <span className="text-muted-foreground italic">...</span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
