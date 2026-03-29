'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToolInput } from '@/components/tools/ToolInput';
import { ToolActions } from '@/components/tools/ToolActions';
import { ClearButton } from '@/components/tools/ClearButton';
import { CopyButton } from '@/components/tools/CopyButton';
import { computeCaseResults } from '@/lib/tools/caseConverter';
import { getToolBySlug } from '@/config/tools';

const SAMPLE_INPUT =
  getToolBySlug('case-converter')?.sampleInput ?? 'hello world example text';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const results = computeCaseResults(input);

  function handleSample() {
    setInput(SAMPLE_INPUT);
  }

  function handleClear() {
    setInput('');
  }

  return (
    <div className="space-y-4">
      <ToolActions>
        <Button onClick={handleSample} variant="outline" size="sm">
          Sample data
        </Button>
        <ClearButton onClear={handleClear} disabled={!input} />
      </ToolActions>

      <ToolInput
        label="Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text to convert…"
        className="min-h-[100px]"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((result) => (
          <Card key={result.label} size="sm">
            <CardContent className="pt-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{result.label}</span>
                <CopyButton text={result.value} size="sm" variant="ghost" />
              </div>
              <p className="min-h-[1.5rem] break-all font-mono text-sm text-foreground">
                {result.value || <span className="italic text-muted-foreground">…</span>}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
