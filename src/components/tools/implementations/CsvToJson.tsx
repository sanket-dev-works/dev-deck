'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Papa from 'papaparse';

const SAMPLE_CSV = `name,age,email,city
Alice,30,alice@example.com,New York
Bob,25,bob@example.com,San Francisco
Charlie,35,charlie@example.com,Chicago`;

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

    if (!input.trim()) {
      setError('Please enter CSV data to convert.');
      return;
    }

    try {
      const result = Papa.parse(input.trim(), {
        header: hasHeader,
        skipEmptyLines: true,
        dynamicTyping: true,
      });

      if (result.errors.length > 0) {
        const errorMessages = result.errors
          .slice(0, 3)
          .map((e) => `Row ${e.row ?? '?'}: ${e.message}`)
          .join('; ');
        setError(`CSV parsing errors: ${errorMessages}`);
        return;
      }

      if (!result.data || result.data.length === 0) {
        setError('No data found in the CSV input.');
        return;
      }

      const json = JSON.stringify(result.data, null, 2);
      setOutput(json);
      setRowCount(result.data.length);

      if (hasHeader && result.meta.fields) {
        setColCount(result.meta.fields.length);
      } else if (Array.isArray(result.data[0])) {
        setColCount((result.data[0] as unknown[]).length);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to parse CSV data.'
      );
    }
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
          <label className="text-sm font-medium text-foreground">CSV Input</label>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Load Sample
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your CSV data here..."
          className="min-h-32 font-mono text-xs"
        />
      </div>

      <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-3">
              <CardTitle>JSON Output</CardTitle>
              <span className="text-xs text-muted-foreground">
                {rowCount} row{rowCount !== 1 ? 's' : ''}
                {colCount > 0 && ` \u00d7 ${colCount} column${colCount !== 1 ? 's' : ''}`}
              </span>
            </div>
            <CopyButton text={output} />
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto rounded-md bg-muted p-3 text-xs font-mono text-foreground max-h-96">
              {output}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
