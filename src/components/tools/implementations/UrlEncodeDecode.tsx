'use client';

import { useState, useEffect } from 'react';
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

export default function UrlEncodeDecode() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [parsedUrl, setParsedUrl] = useState<ParsedUrl | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setParsedUrl(null);
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
        setError('');
        setParsedUrl(null);
      } else if (mode === 'decode') {
        setOutput(decodeURIComponent(input));
        setError('');
        setParsedUrl(null);
      } else {
        const url = new URL(input);
        const params: { key: string; value: string }[] = [];
        url.searchParams.forEach((value, key) => {
          params.push({ key, value });
        });
        setParsedUrl({
          protocol: url.protocol,
          host: url.host,
          pathname: url.pathname,
          searchParams: params,
          hash: url.hash,
        });
        setOutput('');
        setError('');
      }
    } catch {
      setOutput('');
      setParsedUrl(null);
      if (mode === 'decode') {
        setError('Invalid encoded string. Please check your input.');
      } else if (mode === 'parse') {
        setError('Invalid URL. Please enter a valid URL to parse.');
      } else {
        setError('Failed to encode the input string.');
      }
    }
  }, [input, mode]);

  function handleModeChange(newMode: Mode) {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
    setParsedUrl(null);
  }

  function handleSample() {
    setInput(SAMPLE_INPUT);
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setError('');
    setParsedUrl(null);
  }

  const modes: { value: Mode; label: string }[] = [
    { value: 'encode', label: 'Encode' },
    { value: 'decode', label: 'Decode' },
    { value: 'parse', label: 'Parse' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {modes.map((m) => (
            <button
              key={m.value}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card size="sm">
                <CardContent>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">Protocol</span>
                    <CopyButton text={parsedUrl.protocol} size="sm" variant="ghost" />
                  </div>
                  <p className="font-mono text-sm break-all text-foreground">{parsedUrl.protocol}</p>
                </CardContent>
              </Card>

              <Card size="sm">
                <CardContent>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">Host</span>
                    <CopyButton text={parsedUrl.host} size="sm" variant="ghost" />
                  </div>
                  <p className="font-mono text-sm break-all text-foreground">{parsedUrl.host}</p>
                </CardContent>
              </Card>

              <Card size="sm">
                <CardContent>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">Pathname</span>
                    <CopyButton text={parsedUrl.pathname} size="sm" variant="ghost" />
                  </div>
                  <p className="font-mono text-sm break-all text-foreground">{parsedUrl.pathname}</p>
                </CardContent>
              </Card>

              {parsedUrl.hash && (
                <Card size="sm">
                  <CardContent>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">Hash</span>
                      <CopyButton text={parsedUrl.hash} size="sm" variant="ghost" />
                    </div>
                    <p className="font-mono text-sm break-all text-foreground">{parsedUrl.hash}</p>
                  </CardContent>
                </Card>
              )}

              {parsedUrl.searchParams.map((param, index) => (
                <Card key={index} size="sm">
                  <CardContent>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">{param.key}</span>
                      <CopyButton text={param.value} size="sm" variant="ghost" />
                    </div>
                    <p className="font-mono text-sm break-all text-foreground">{param.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!parsedUrl && !error && input.trim() === '' && (
            <p className="text-sm text-muted-foreground">Enter a URL above to see its parsed components.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                <pre className="font-mono text-sm whitespace-pre-wrap break-all text-foreground">
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
