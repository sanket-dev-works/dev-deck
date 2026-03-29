'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/tools/CopyButton';
import { copyToClipboard } from '@/lib/utils/clipboard';
import { Check } from 'lucide-react';

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = useCallback(() => {
    const generated = Array.from({ length: count }, () => {
      const id = uuidv4();
      return uppercase ? id.toUpperCase() : id;
    });
    setUuids(generated);
  }, [count, uppercase]);

  useEffect(() => {
    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Config Panel */}
        <Card>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Count</label>
              <div className="flex gap-2">
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

            <div className="flex gap-2">
              <Button onClick={generate} variant="default" size="sm">
                Generate
              </Button>
              <Button onClick={generate} variant="outline" size="sm">
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              Generated UUIDs ({uuids.length})
            </label>
            <CopyButton text={allUuidsText} label="Copy All" size="sm" variant="ghost" />
          </div>
          <Card className="min-h-[250px]">
            <CardContent>
              <div className="space-y-1">
                {uuids.map((uuid, index) => (
                  <button
                    key={index}
                    onClick={() => handleCopyOne(uuid, index)}
                    className="flex w-full items-center gap-2 rounded px-2 py-1 text-left font-mono text-sm transition-colors hover:bg-muted group"
                    title="Click to copy"
                  >
                    <span className="flex-1 break-all text-foreground">{uuid}</span>
                    {copiedIndex === index ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
