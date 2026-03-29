'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ArrowLeftRight, Check } from 'lucide-react';

interface DiffEntry {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue?: unknown;
  newValue?: unknown;
}

const SAMPLE_LEFT = JSON.stringify(
  {
    name: 'DevDeck',
    version: '1.0.0',
    description: 'Developer toolkit',
    features: ['jwt', 'base64', 'json'],
    config: {
      theme: 'dark',
      language: 'en',
      debug: false,
    },
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
    config: {
      theme: 'light',
      language: 'en',
      verbose: true,
    },
  },
  null,
  2
);

function compareJson(
  left: unknown,
  right: unknown,
  path: string = ''
): DiffEntry[] {
  const diffs: DiffEntry[] = [];

  if (left === right) return diffs;

  if (
    left === null ||
    right === null ||
    typeof left !== typeof right ||
    typeof left !== 'object' ||
    Array.isArray(left) !== Array.isArray(right)
  ) {
    diffs.push({ path: path || '(root)', type: 'changed', oldValue: left, newValue: right });
    return diffs;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const maxLen = Math.max(left.length, right.length);
    for (let i = 0; i < maxLen; i++) {
      const itemPath = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= left.length) {
        diffs.push({ path: itemPath, type: 'added', newValue: right[i] });
      } else if (i >= right.length) {
        diffs.push({ path: itemPath, type: 'removed', oldValue: left[i] });
      } else {
        diffs.push(...compareJson(left[i], right[i], itemPath));
      }
    }
    return diffs;
  }

  const leftObj = left as Record<string, unknown>;
  const rightObj = right as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);

  for (const key of allKeys) {
    const keyPath = path ? `${path}.${key}` : key;
    if (!(key in leftObj)) {
      diffs.push({ path: keyPath, type: 'added', newValue: rightObj[key] });
    } else if (!(key in rightObj)) {
      diffs.push({ path: keyPath, type: 'removed', oldValue: leftObj[key] });
    } else {
      diffs.push(...compareJson(leftObj[key], rightObj[key], keyPath));
    }
  }

  return diffs;
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`;
  if (value === null) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function buildDiffSummary(diffs: DiffEntry[]): string {
  return diffs
    .map((d) => {
      switch (d.type) {
        case 'added':
          return `+ ${d.path}: ${formatValue(d.newValue)}`;
        case 'removed':
          return `- ${d.path}: ${formatValue(d.oldValue)}`;
        case 'changed':
          return `~ ${d.path}: ${formatValue(d.oldValue)} -> ${formatValue(d.newValue)}`;
      }
    })
    .join('\n');
}

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

    const result = compareJson(leftParsed, rightParsed);
    setDiffs(result);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Left JSON</label>
          <Textarea
            value={leftJson}
            onChange={(e) => setLeftJson(e.target.value)}
            placeholder="Paste first JSON here..."
            className="min-h-48 font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Right JSON</label>
          <Textarea
            value={rightJson}
            onChange={(e) => setRightJson(e.target.value)}
            placeholder="Paste second JSON here..."
            className="min-h-48 font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={handleCompare}>Compare</Button>
        <Button variant="outline" onClick={handleSwap}>
          <ArrowLeftRight className="h-3.5 w-3.5 mr-1.5" />
          Swap
        </Button>
        <Button variant="outline" size="sm" onClick={handleLoadSample}>
          Load Sample
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {diffs !== null && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>
              {diffs.length === 0 ? 'No Differences' : `${diffs.length} Difference${diffs.length !== 1 ? 's' : ''} Found`}
            </CardTitle>
            {diffs.length > 0 && <CopyButton text={diffSummary} />}
          </CardHeader>
          <CardContent>
            {diffs.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Check className="h-4 w-4" />
                Both JSON objects are identical.
              </div>
            ) : (
              <div className="space-y-2">
                {diffs.map((diff, idx) => (
                  <div
                    key={idx}
                    className={`rounded-md px-3 py-2 text-xs font-mono ${
                      diff.type === 'added'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : diff.type === 'removed'
                          ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    }`}
                  >
                    <span className="font-semibold">{diff.path}</span>
                    {diff.type === 'added' && (
                      <span>
                        {' '}
                        <span className="text-muted-foreground">added:</span>{' '}
                        {formatValue(diff.newValue)}
                      </span>
                    )}
                    {diff.type === 'removed' && (
                      <span>
                        {' '}
                        <span className="text-muted-foreground">removed:</span>{' '}
                        {formatValue(diff.oldValue)}
                      </span>
                    )}
                    {diff.type === 'changed' && (
                      <span>
                        {' '}
                        <span className="text-muted-foreground">changed:</span>{' '}
                        <span className="line-through opacity-60">
                          {formatValue(diff.oldValue)}
                        </span>{' '}
                        <span className="text-muted-foreground">&rarr;</span>{' '}
                        {formatValue(diff.newValue)}
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
