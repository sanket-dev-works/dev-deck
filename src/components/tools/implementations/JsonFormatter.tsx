'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToolInput } from '@/components/tools/ToolInput';
import { ToolOutput } from '@/components/tools/ToolOutput';
import { ToolActions } from '@/components/tools/ToolActions';
import { ClearButton } from '@/components/tools/ClearButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { formatJson, minifyJson, parseJson } from '@/lib/tools/jsonFormatter';
import { getToolBySlug } from '@/config/tools';

const SAMPLE_JSON =
  getToolBySlug('json-formatter')?.sampleInput ??
  '{"name":"DevDeck","version":1,"tools":["json","jwt","regex"]}';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function applyFormat(indent: number) {
    const result = formatJson(input, indent);
    if (!result.ok) {
      setOutput('');
      setError(result.error);
      return;
    }
    setOutput(result.value);
    setError('');
  }

  function applyMinify() {
    const result = minifyJson(input);
    if (!result.ok) {
      setOutput('');
      setError(result.error);
      return;
    }
    setOutput(result.value);
    setError('');
  }

  function handleInputChange(value: string) {
    setInput(value);
    if (!value.trim()) {
      setError('');
      setOutput('');
      return;
    }
    const parsed = parseJson(value);
    if (!parsed.ok) {
      setError(parsed.error || 'Invalid JSON');
      setOutput('');
    } else {
      setError('');
    }
  }

  function handleSample() {
    setInput(SAMPLE_JSON);
    const result = formatJson(SAMPLE_JSON, 2);
    if (result.ok) {
      setOutput(result.value);
      setError('');
    }
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setError('');
  }

  return (
    <div className="space-y-4">
      <ToolActions>
        <Button onClick={() => applyFormat(2)} variant="secondary" size="sm">
          Format (2-space)
        </Button>
        <Button onClick={() => applyFormat(4)} variant="secondary" size="sm">
          Format (4-space)
        </Button>
        <Button onClick={applyMinify} variant="secondary" size="sm">
          Minify
        </Button>
        <Button onClick={handleSample} variant="outline" size="sm">
          Sample data
        </Button>
        <ClearButton onClear={handleClear} disabled={!input && !output} />
      </ToolActions>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ToolInput
          label="Input"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Paste your JSON here..."
          className="min-h-[300px]"
        />
        <ToolOutput
          label="Output"
          value={output}
          emptyHint="Formatted JSON will appear here…"
          minHeightClassName="min-h-[300px]"
        />
      </div>
    </div>
  );
}
