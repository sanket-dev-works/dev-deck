'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToolInput } from '@/components/tools/ToolInput';
import { ClearButton } from '@/components/tools/ClearButton';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import {
  buildTimestampRows,
  parseDateInput,
  parseTimestampInput,
} from '@/lib/tools/timestamp';

type InputMode = 'timestamp' | 'date';

export default function TimestampConverter() {
  const [mode, setMode] = useState<InputMode>('timestamp');
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState('');

  function process(value: string, currentMode: InputMode) {
    if (!value.trim()) {
      setResults([]);
      setError('');
      return;
    }

    let d = null;
    if (currentMode === 'timestamp') {
      d = parseTimestampInput(value);
      if (!d || !d.isValid()) {
        setError('Invalid timestamp. Enter a Unix timestamp in seconds or milliseconds.');
        setResults([]);
        return;
      }
    } else {
      d = parseDateInput(value);
      if (!d || !d.isValid()) {
        setError(
          'Invalid date. Try formats like: 2024-01-15, 2024-01-15T10:30:00Z, Jan 15 2024'
        );
        setResults([]);
        return;
      }
    }

    setError('');
    setResults(buildTimestampRows(d));
  }

  function handleInputChange(value: string) {
    setInput(value);
    process(value, mode);
  }

  function handleModeChange(newMode: InputMode) {
    setMode(newMode);
    setInput('');
    setResults([]);
    setError('');
  }

  function handleNow() {
    const now =
      mode === 'timestamp' ? String(Math.floor(Date.now() / 1000)) : dayjs().toISOString();
    setInput(now);
    process(now, mode);
  }

  function handleClear() {
    setInput('');
    setResults([]);
    setError('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-border">
          <button
            type="button"
            onClick={() => handleModeChange('timestamp')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === 'timestamp'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            From timestamp
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('date')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === 'date'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            From date
          </button>
        </div>

        <Button onClick={handleNow} variant="secondary" size="sm">
          Now
        </Button>
        <ClearButton onClear={handleClear} disabled={!input && results.length === 0} />
      </div>

      {error && <ErrorMessage message={error} />}

      <ToolInput
        label={mode === 'timestamp' ? 'Unix timestamp' : 'Date string'}
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={
          mode === 'timestamp'
            ? 'Unix timestamp (seconds or milliseconds)…'
            : 'Date string (e.g. 2024-01-15T10:30:00Z)…'
        }
        className="min-h-[60px]"
      />

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Card key={result.label} size="sm">
              <CardContent className="pt-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{result.label}</span>
                  <CopyButton text={result.value} size="sm" variant="ghost" />
                </div>
                <p className="break-all font-mono text-sm text-foreground">{result.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {results.length === 0 && !error && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Enter a {mode === 'timestamp' ? 'timestamp' : 'date'} above to see conversions
          </CardContent>
        </Card>
      )}
    </div>
  );
}
