'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';

type Mode = 'encode' | 'decode';

const SAMPLE_ENCODE = 'Hello, DevDeck! This is a sample string with special chars: @#$%^&*()';
const SAMPLE_DECODE = 'SGVsbG8sIERldkRlY2shIFRoaXMgaXMgYSBzYW1wbGUgc3RyaW5nIHdpdGggc3BlY2lhbCBjaGFyczogQCMkJV4mKigp';

function base64Encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

function base64Decode(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}

export default function Base64EncodeDecode() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(base64Encode(input));
        setError('');
      } else {
        setOutput(base64Decode(input));
        setError('');
      }
    } catch {
      setOutput('');
      setError(
        mode === 'decode'
          ? 'Invalid Base64 string. Please check your input.'
          : 'Failed to encode the input string.'
      );
    }
  }, [input, mode]);

  function handleModeChange(newMode: Mode) {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  }

  function handleSample() {
    setInput(mode === 'encode' ? SAMPLE_ENCODE : SAMPLE_DECODE);
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setError('');
  }

  function handleSwap() {
    if (output && !error) {
      const newMode = mode === 'encode' ? 'decode' : 'encode';
      setMode(newMode);
      setInput(output);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => handleModeChange('encode')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === 'encode'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => handleModeChange('decode')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === 'decode'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Decode
          </button>
        </div>

        <Button onClick={handleSwap} variant="outline" size="sm" disabled={!output || !!error}>
          Swap
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
          <label className="text-sm font-medium text-muted-foreground">
            {mode === 'encode' ? 'Plain Text' : 'Base64 Input'}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Enter text to encode...'
                : 'Enter Base64 string to decode...'
            }
            className="min-h-[250px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
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
    </div>
  );
}
