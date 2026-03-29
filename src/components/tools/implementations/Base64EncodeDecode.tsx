'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToolInput } from '@/components/tools/ToolInput';
import { ToolOutput } from '@/components/tools/ToolOutput';
import { ClearButton } from '@/components/tools/ClearButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { base64Decode, base64Encode } from '@/lib/tools/base64';
import { getToolBySlug } from '@/config/tools';

type Mode = 'encode' | 'decode';

const tool = getToolBySlug('base64-encode-decode');
const SAMPLE_ENCODE =
  'Hello, DevDeck! This is a sample string with special chars: @#$%^&*()';
const SAMPLE_DECODE =
  tool?.sampleInput ??
  'SGVsbG8sIERldkRlY2shIFRoaXMgaXMgYSBzYW1wbGUgc3RyaW5nIHdpdGggc3BlY2lhbCBjaGFyczogQCMkJV4mKigp';

export default function Base64EncodeDecode() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: '' };
    }
    const result = mode === 'encode' ? base64Encode(input) : base64Decode(input.trim());
    if (!result.ok) {
      return { output: '', error: result.error };
    }
    return { output: result.value, error: '' };
  }, [input, mode]);

  function handleModeChange(newMode: Mode) {
    setMode(newMode);
    setInput('');
  }

  function handleSample() {
    setInput(mode === 'encode' ? SAMPLE_ENCODE : SAMPLE_DECODE);
  }

  function handleClear() {
    setInput('');
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
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-border">
          <button
            type="button"
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
            type="button"
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
          Sample data
        </Button>
        <ClearButton onClear={handleClear} disabled={!input && !output} />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ToolInput
          label={mode === 'encode' ? 'Plain text' : 'Base64 input'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'encode' ? 'Enter text to encode…' : 'Enter Base64 string to decode…'
          }
          className="min-h-[250px]"
        />
        <ToolOutput
          label={mode === 'encode' ? 'Base64 output' : 'Decoded text'}
          value={output}
          emptyHint={
            mode === 'encode' ? 'Encoded output will appear here…' : 'Decoded output will appear here…'
          }
          minHeightClassName="min-h-[250px]"
        />
      </div>
    </div>
  );
}
