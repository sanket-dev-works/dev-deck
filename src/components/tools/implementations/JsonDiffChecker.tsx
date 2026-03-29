'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ArrowLeftRight, Check } from 'lucide-react';
import {
  type DiffEntry,
  buildDiffSummary,
  compareJson,
  formatDiffValue,
} from '@/lib/tools/jsonDiff';

const SAMPLE_LEFT = JSON.stringify(
  {
    name: 'DevDeck',
    version: '1.0.0',
    description: 'Developer toolkit',
    features: ['jwt', 'base64', 'json'],
    config: { theme: 'dark', language: 'en', debug: false },
  },
  null,
  2
);

const SAMPLE_RIGHT = JSON.stringify(
  {
    name: 'DevDeck',
    version: '1.1.0',
    description: 'Developer toolkit pro',
    features: ['jwt', 'base64', 'json', 'csv'],
    config: { theme: 'light', language: 'en', verbose: true },
  },
  null,
  2
);

export default function JsonDiffChecker() {
  const [leftJson, setLeftJson] = useState('');
  const [rightJson, setRightJson] = useState('');
  const [diffs, setDiffs] = useState<DiffEntry[] | null>(null);
  const [error, setError] = useState('');

  function handleCompare() {
    setError('');
    setDiffs(null);

    if (!leftJson.trim() || !rightJson.trim()) {
      setError('Please provide JSON on both sides.');
      return;
    }

    let leftParsed: unknown;
    let rightParsed: unknown;

    try {
      leftParsed = JSON.parse(leftJson);
    } catch {
      setError('Left JSON is invalid. Please check the syntax.');
      return;
    }

    try {
      rightParsed = JSON.parse(rightJson);
    } catch {
      setError('Right JSON is invalid. Please check the syntax.');
      return;
    }

    setDiffs(compareJson(leftParsed, rightParsed));
  }

  function handleSwap() {
    const temp = leftJson;
    setLeftJson(rightJson);
    setRightJson(temp);
    setDiffs(null);
  }

  function handleLoadSample() {
    setLeftJson(SAMPLE_LEFT);
    setRightJson(SAMPLE_RIGHT);
    setDiffs(null);
    setError('');
  }

  const diffSummary = diffs ? buildDiffSummary(diffs) : '';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Left JSON</span>
          <Textarea
            value={leftJson}
            onChange={(e) => setLeftJson(e.target.value)}
            placeholder="Paste first JSON here…"
            className="min-h-48 font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Right JSON</span>
          <Textarea
            value={rightJson}
            onChange={(e) => setRightJson(e.target.value)}
            placeholder="Paste second JSON here…"
            className="min-h-48 font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleCompare}>Compare</Button>
        <Button variant="outline" onClick={handleSwap}>
          <ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" />
          Swap
        </Button>
        <Button variant="outline" size="sm" onClick={handleLoadSample}>
          Load sample
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {diffs !== null && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>
              {diffs.length === 0
                ? 'No differences'
                : `${diffs.length} difference${diffs.length !== 1 ? 's' : ''} found`}
            </CardTitle>
            {diffs.length > 0 && <CopyButton text={diffSummary} />}
          </CardHeader>
          <CardContent>
            {diffs.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Check className="h-4 w-4" />
                Both JSON values are structurally equal.
              </div>
            ) : (
              <div className="space-y-2">
                {diffs.map((diff, idx) => (
                  <div
                    key={`${diff.path}-${idx}`}
                    className={`rounded-md px-3 py-2 font-mono text-xs ${
                      diff.type === 'added'
                        ? 'border border-green-500/20 bg-green-500/10 text-green-400'
                        : diff.type === 'removed'
                          ? 'border border-red-500/20 bg-red-500/10 text-red-400'
                          : 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    <span className="font-semibold">{diff.path}</span>
                    {diff.type === 'added' && (
                      <span>
                        {' '}
                        <span className="text-muted-foreground">added:</span>{' '}
                        {formatDiffValue(diff.newValue)}
                      </span>
                    )}
                    {diff.type === 'removed' && (
                      <span>
                        {' '}
                        <span className="text-muted-foreground">removed:</span>{' '}
                        {formatDiffValue(diff.oldValue)}
                      </span>
                    )}
                    {diff.type === 'changed' && (
                      <span>
                        {' '}
                        <span className="text-muted-foreground">changed:</span>{' '}
                        <span className="line-through opacity-60">
                          {formatDiffValue(diff.oldValue)}
                        </span>{' '}
                        <span className="text-muted-foreground">→</span>{' '}
                        {formatDiffValue(diff.newValue)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
