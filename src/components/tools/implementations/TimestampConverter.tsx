'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';

dayjs.extend(utc);
dayjs.extend(relativeTime);

type InputMode = 'timestamp' | 'date';

interface ConversionResult {
  label: string;
  value: string;
}

function parseTimestamp(input: string): dayjs.Dayjs | null {
  const num = Number(input.trim());
  if (isNaN(num)) return null;

  // Auto-detect seconds vs milliseconds
  if (num > 1e12) {
    // Treat as milliseconds
    return dayjs(num);
  }
  // Treat as seconds
  return dayjs.unix(num);
}

function parseDate(input: string): dayjs.Dayjs | null {
  const d = dayjs(input.trim());
  return d.isValid() ? d : null;
}

function getResults(d: dayjs.Dayjs): ConversionResult[] {
  return [
    { label: 'Unix (seconds)', value: String(d.unix()) },
    { label: 'Unix (milliseconds)', value: String(d.valueOf()) },
    { label: 'ISO 8601', value: d.toISOString() },
    { label: 'UTC', value: d.utc().format('ddd, DD MMM YYYY HH:mm:ss [UTC]') },
    { label: 'Local', value: d.format('YYYY-MM-DD HH:mm:ss Z') },
    { label: 'Relative', value: d.fromNow() },
  ];
}

export default function TimestampConverter() {
  const [mode, setMode] = useState<InputMode>('timestamp');
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [error, setError] = useState('');

  function process(value: string, currentMode: InputMode) {
    if (!value.trim()) {
      setResults([]);
      setError('');
      return;
    }

    let d: dayjs.Dayjs | null = null;

    if (currentMode === 'timestamp') {
      d = parseTimestamp(value);
      if (!d || !d.isValid()) {
        setError('Invalid timestamp. Enter a Unix timestamp in seconds or milliseconds.');
        setResults([]);
        return;
      }
    } else {
      d = parseDate(value);
      if (!d || !d.isValid()) {
        setError('Invalid date. Try formats like: 2024-01-15, 2024-01-15T10:30:00Z, Jan 15 2024');
        setResults([]);
        return;
      }
    }

    setError('');
    setResults(getResults(d));
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
    const now = mode === 'timestamp'
      ? String(Math.floor(Date.now() / 1000))
      : dayjs().toISOString();
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
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => handleModeChange('timestamp')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === 'timestamp'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            From Timestamp
          </button>
          <button
            onClick={() => handleModeChange('date')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === 'date'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            From Date
          </button>
        </div>

        <Button onClick={handleNow} variant="secondary" size="sm">
          Now
        </Button>
        <Button onClick={handleClear} variant="ghost" size="sm">
          Clear
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          {mode === 'timestamp' ? 'Unix Timestamp' : 'Date String'}
        </label>
        <Textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={
            mode === 'timestamp'
              ? 'Enter a Unix timestamp (e.g., 1700000000 or 1700000000000)...'
              : 'Enter a date (e.g., 2024-01-15T10:30:00Z)...'
          }
          className="min-h-[60px] font-mono text-sm"
        />
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((result) => (
            <Card key={result.label} size="sm">
              <CardContent>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {result.label}
                  </span>
                  <CopyButton text={result.value} size="sm" variant="ghost" />
                </div>
                <p className="font-mono text-sm break-all text-foreground">
                  {result.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {results.length === 0 && !error && (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Enter a {mode === 'timestamp' ? 'timestamp' : 'date'} above to see conversions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
