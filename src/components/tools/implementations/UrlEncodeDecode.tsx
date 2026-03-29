'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';

type Mode = 'encode' | 'decode' | 'parse';

const SAMPLE_INPUT = 'https://example.com/search?q=hello world&lang=en&sort=relevance#results';

interface ParsedUrl {
  protocol: string;
  host: string;
  pathname: string;
  searchParams: { key: string; value: string }[];
  hash: string;
}

function computeUrlResult(
  input: string,
  mode: Mode
): { output: string; error: string; parsedUrl: ParsedUrl | null } {
  if (!input.trim()) {
    return { output: '', error: '', parsedUrl: null };
  }

  try {
    if (mode === 'encode') {
      return { output: encodeURIComponent(input), error: '', parsedUrl: null };
    }
    if (mode === 'decode') {
      return { output: decodeURIComponent(input), error: '', parsedUrl: null };
    }
    const url = new URL(input);
    const params: { key: string; value: string }[] = [];
    url.searchParams.forEach((value, key) => {
      params.push({ key, value });
    });
    return {
      output: '',
      error: '',
      parsedUrl: {
        protocol: url.protocol,
        host: url.host,
        pathname: url.pathname,
        searchParams: params,
        hash: url.hash,
      },
    };
  } catch {
    if (mode === 'decode') {
      return {
        output: '',
        error: 'Invalid encoded string. Please check your input.',
        parsedUrl: null,
      };
    }
    if (mode === 'parse') {
      return {
        output: '',
        error: 'Invalid URL. Please enter a valid URL to parse.',
        parsedUrl: null,
      };
    }
    return {
      output: '',
      error: 'Failed to encode the input string.',
      parsedUrl: null,
    };
  }
}

export default function UrlEncodeDecode() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');

  const { output, error, parsedUrl } = useMemo(
    () => computeUrlResult(input, mode),
    [input, mode]
  );

  function handleModeChange(newMode: Mode) {
    setMode(newMode);
    setInput('');
  }

  function handleSample() {
    setInput(SAMPLE_INPUT);
  }

  function handleClear() {
    setInput('');
  }

  const modes: { value: Mode; label: string }[] = [
    { value: 'encode', label: 'Encode' },
    { value: 'decode', label: 'Decode' },
    { value: 'parse', label: 'Parse' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-border">
          {modes.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => handleModeChange(m.value)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                mode === m.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <Button onClick={handleSample} variant="outline" size="sm">
          Sample Data
        </Button>
        <Button onClick={handleClear} variant="ghost" size="sm">
          Clear
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {mode === 'parse' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">URL Input</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a URL to parse..."
              className="min-h-[100px] font-mono text-sm"
            />
          </div>

          {parsedUrl && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Card size="sm">
                <CardContent>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Protocol</span>
                    <CopyButton text={parsedUrl.protocol} size="sm" variant="ghost" />
                  </div>
                  <p className="break-all font-mono text-sm text-foreground">{parsedUrl.protocol}</p>
                </CardContent>
              </Card>

              <Card size="sm">
                <CardContent>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Host</span>
                    <CopyButton text={parsedUrl.host} size="sm" variant="ghost" />
                  </div>
                  <p className="break-all font-mono text-sm text-foreground">{parsedUrl.host}</p>
                </CardContent>
              </Card>

              <Card size="sm">
                <CardContent>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Pathname</span>
                    <CopyButton text={parsedUrl.pathname} size="sm" variant="ghost" />
                  </div>
                  <p className="break-all font-mono text-sm text-foreground">{parsedUrl.pathname}</p>
                </CardContent>
              </Card>

              {parsedUrl.hash && (
                <Card size="sm">
                  <CardContent>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Hash</span>
                      <CopyButton text={parsedUrl.hash} size="sm" variant="ghost" />
                    </div>
                    <p className="break-all font-mono text-sm text-foreground">{parsedUrl.hash}</p>
                  </CardContent>
                </Card>
              )}

              {parsedUrl.searchParams.map((param, index) => (
                <Card key={`${param.key}-${index}`} size="sm">
                  <CardContent>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">{param.key}</span>
                      <CopyButton text={param.value} size="sm" variant="ghost" />
                    </div>
                    <p className="break-all font-mono text-sm text-foreground">{param.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!parsedUrl && !error && input.trim() === '' && (
            <p className="text-sm text-muted-foreground">
              Enter a URL above to see its parsed components.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {mode === 'encode' ? 'Plain Text' : 'Encoded Input'}
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'encode'
                  ? 'Enter text to URL encode...'
                  : 'Enter URL encoded string to decode...'
              }
              className="min-h-[250px] font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
              </label>
              <CopyButton text={output} label="Copy" size="sm" variant="ghost" />
            </div>
            <Card className="min-h-[250px]">
              <CardContent>
                <pre className="whitespace-pre-wrap break-all font-mono text-sm text-foreground">
                  {output || (
                    <span className="text-muted-foreground">
                      {mode === 'encode' ? 'Encoded output' : 'Decoded output'} will appear here...
                    </span>
                  )}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
