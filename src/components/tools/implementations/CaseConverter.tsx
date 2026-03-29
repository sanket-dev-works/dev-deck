'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';

const SAMPLE_INPUT = 'hello world example text';

function splitWords(input: string): string[] {
  if (!input.trim()) return [];

  return input
    // Insert space before uppercase letters that follow lowercase letters (camelCase boundary)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Insert space before uppercase letters that are followed by lowercase letters in a sequence of uppercase (e.g., HTMLParser -> HTML Parser)
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    // Replace underscores and hyphens with spaces
    .replace(/[_\-]/g, ' ')
    // Split on whitespace
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function toCamelCase(words: string[]): string {
  if (words.length === 0) return '';
  return words
    .map((w, i) =>
      i === 0
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join('');
}

function toPascalCase(words: string[]): string {
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function toSnakeCase(words: string[]): string {
  return words.map((w) => w.toLowerCase()).join('_');
}

function toKebabCase(words: string[]): string {
  return words.map((w) => w.toLowerCase()).join('-');
}

function toUpperCase(words: string[]): string {
  return words.map((w) => w.toUpperCase()).join('_');
}

function toLowerCaseSpaced(words: string[]): string {
  return words.map((w) => w.toLowerCase()).join(' ');
}

function toTitleCase(words: string[]): string {
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

interface CaseResult {
  label: string;
  value: string;
  converter: (words: string[]) => string;
}

const CASES: CaseResult[] = [
  { label: 'camelCase', value: '', converter: toCamelCase },
  { label: 'PascalCase', value: '', converter: toPascalCase },
  { label: 'snake_case', value: '', converter: toSnakeCase },
  { label: 'kebab-case', value: '', converter: toKebabCase },
  { label: 'UPPER_CASE', value: '', converter: toUpperCase },
  { label: 'lower case', value: '', converter: toLowerCaseSpaced },
  { label: 'Title Case', value: '', converter: toTitleCase },
];

export default function CaseConverter() {
  const [input, setInput] = useState('');

  const words = splitWords(input);

  const results = CASES.map((c) => ({
    ...c,
    value: words.length > 0 ? c.converter(words) : '',
  }));

  function handleSample() {
    setInput(SAMPLE_INPUT);
  }

  function handleClear() {
    setInput('');
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleSample} variant="outline" size="sm">
          Sample Data
        </Button>
        <Button onClick={handleClear} variant="ghost" size="sm">
          Clear
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Input</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to convert..."
          className="min-h-[100px] text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {results.map((result) => (
          <Card key={result.label} size="sm">
            <CardContent>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">{result.label}</span>
                <CopyButton text={result.value} size="sm" variant="ghost" />
              </div>
              <p className="font-mono text-sm break-all text-foreground min-h-[1.5rem]">
                {result.value || (
                  <span className="text-muted-foreground italic">...</span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
