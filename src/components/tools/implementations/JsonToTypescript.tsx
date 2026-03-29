'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ToolActions } from '@/components/tools/ToolActions';
import { generateTypescriptFromJson } from '@/lib/tools/jsonToTypescript';
import { getToolBySlug } from '@/config/tools';

const SAMPLE_JSON =
  getToolBySlug('json-to-typescript')?.sampleInput ??
  JSON.stringify(
    {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      isActive: true,
      roles: ['admin', 'user'],
      address: { street: '123 Main', city: 'Springfield' },
    },
    null,
    2
  );

export default function JsonToTypescript() {
  const [input, setInput] = useState('');
  const [rootName, setRootName] = useState('Root');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleGenerate() {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON to convert.');
      return;
    }

    const name = rootName.trim() || 'Root';

    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch {
      setError('Invalid JSON. Please check the syntax.');
      return;
    }

    try {
      setOutput(generateTypescriptFromJson(parsed, name));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate TypeScript types.');
    }
  }

  function handleLoadSample() {
    setInput(SAMPLE_JSON);
    setRootName('Root');
    setOutput('');
    setError('');
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">JSON input</span>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Load sample
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here…"
          className="min-h-40 font-mono text-xs"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="root-name" className="whitespace-nowrap text-sm font-medium text-foreground">
            Root interface name
          </label>
          <Input
            id="root-name"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            placeholder="Root"
            className="max-w-xs font-mono text-sm"
          />
        </div>
        <ToolActions className="sm:ml-auto">
          <Button onClick={handleGenerate}>Generate</Button>
        </ToolActions>
      </div>

      {error && <ErrorMessage message={error} />}

      {output && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>TypeScript types</CardTitle>
            <CopyButton text={output} />
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-auto rounded-md bg-muted p-3 font-mono text-xs text-foreground">
              {output}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
