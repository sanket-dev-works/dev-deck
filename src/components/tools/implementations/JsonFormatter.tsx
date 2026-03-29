'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';

const SAMPLE_JSON = '{"name":"DevDeck","version":1,"tools":["json","jwt","regex"],"config":{"theme":"dark","language":"en"}}';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function validateAndFormat(value: string, indent?: number) {
    if (!value.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(value);
      const formatted = indent !== undefined
        ? JSON.stringify(parsed, null, indent)
        : JSON.stringify(parsed);
      setOutput(formatted);
      setError('');
    } catch (e) {
      setOutput('');
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  }

  function handleInputChange(value: string) {
    setInput(value);
    if (value.trim()) {
      try {
        JSON.parse(value);
        setError('');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Invalid JSON');
        setOutput('');
      }
    } else {
      setError('');
      setOutput('');
    }
  }

  function handleFormat(indent: number) {
    validateAndFormat(input, indent);
  }

  function handleMinify() {
    validateAndFormat(input);
  }

  function handleSample() {
    setInput(SAMPLE_JSON);
    validateAndFormat(SAMPLE_JSON, 2);
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setError('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => handleFormat(2)} variant="secondary" size="sm">
          Format (2-space)
        </Button>
        <Button onClick={() => handleFormat(4)} variant="secondary" size="sm">
          Format (4-space)
        </Button>
        <Button onClick={handleMinify} variant="secondary" size="sm">
          Minify
        </Button>
        <Button onClick={handleSample} variant="outline" size="sm">
          Sample Data
        </Button>
        <Button onClick={handleClear} variant="ghost" size="sm">
          Clear
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Input</label>
          <Textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste your JSON here..."
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Output</label>
            <CopyButton text={output} label="Copy" size="sm" variant="ghost" />
          </div>
          <Card className="min-h-[300px]">
            <CardContent>
              <pre className="font-mono text-sm whitespace-pre-wrap break-all text-foreground">
                {output || (
                  <span className="text-muted-foreground">
                    Formatted JSON will appear here...
                  </span>
                )}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
