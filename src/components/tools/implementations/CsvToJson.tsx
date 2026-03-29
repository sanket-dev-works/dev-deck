'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { csvToJson } from '@/lib/tools/csvToJson';
import { getToolBySlug } from '@/config/tools';

const SAMPLE_CSV =
  getToolBySlug('csv-to-json')?.sampleInput ??
  `name,age,email,city
Alice,30,alice@example.com,New York
Bob,25,bob@example.com,San Francisco`;

export default function CsvToJson() {
  const [input, setInput] = useState('');
  const [hasHeader, setHasHeader] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [colCount, setColCount] = useState(0);

  function handleConvert() {
    setError('');
    setOutput('');
    setRowCount(0);
    setColCount(0);

    const result = csvToJson(input, { header: hasHeader });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setOutput(result.json);
    setRowCount(result.rowCount);
    setColCount(result.colCount);
  }

  function handleLoadSample() {
    setInput(SAMPLE_CSV);
    setHasHeader(true);
    setOutput('');
    setError('');
    setRowCount(0);
    setColCount(0);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">CSV input</span>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Load sample
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your CSV data here…"
          className="min-h-32 font-mono text-xs"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={hasHeader}
            onCheckedChange={(checked: boolean) => setHasHeader(checked)}
            id="has-header"
          />
          <Label htmlFor="has-header" className="text-sm text-muted-foreground">
            Has header row
          </Label>
        </div>
        <Button onClick={handleConvert}>Convert</Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {output && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>JSON output</CardTitle>
              <span className="text-xs text-muted-foreground">
                {rowCount} row{rowCount !== 1 ? 's' : ''}
                {colCount > 0 && ` × ${colCount} column${colCount !== 1 ? 's' : ''}`}
              </span>
            </div>
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
