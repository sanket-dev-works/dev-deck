'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/tools/CopyButton';
import { copyToClipboard } from '@/lib/utils/clipboard';
import { Check } from 'lucide-react';
import { generateUuids } from '@/lib/tools/uuid';

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState(() => generateUuids(1, false));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = useCallback(() => {
    setUuids(generateUuids(count, uppercase));
  }, [count, uppercase]);

  async function handleCopyOne(uuid: string, index: number) {
    const success = await copyToClipboard(uuid);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }

  const allUuidsText = uuids.join('\n');
  const countOptions = [1, 5, 10, 25];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Count</span>
              <div className="flex flex-wrap gap-2">
                {countOptions.map((n) => (
                  <Button
                    key={n}
                    variant={count === n ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCount(n)}
                  >
                    {n}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="uppercase-toggle" className="text-sm font-medium text-muted-foreground">
                Uppercase
              </label>
              <input
                id="uppercase-toggle"
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} variant="default" size="sm">
                Generate
              </Button>
              <Button onClick={generate} variant="outline" size="sm">
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Generated UUIDs ({uuids.length})
            </span>
            <CopyButton text={allUuidsText} label="Copy all" size="sm" variant="ghost" />
          </div>
          <Card className="min-h-[250px]">
            <CardContent className="pt-6">
              <div className="space-y-1">
                {uuids.map((uuid, index) => (
                  <button
                    key={`${uuid}-${index}`}
                    type="button"
                    onClick={() => handleCopyOne(uuid, index)}
                    className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left font-mono text-sm transition-colors hover:bg-muted"
                    title="Click to copy"
                  >
                    <span className="flex-1 break-all text-foreground">{uuid}</span>
                    {copiedIndex === index ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                    ) : (
                      <span className="shrink-0 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        click to copy
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
