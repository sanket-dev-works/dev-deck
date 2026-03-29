'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';

const SAMPLE_JSON = JSON.stringify(
  {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    isActive: true,
    roles: ['admin', 'user'],
    address: {
      street: '123 Main',
      city: 'Springfield',
    },
  },
  null,
  2
);

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function inferType(
  value: unknown,
  name: string,
  interfaces: Map<string, string>
): string {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'unknown[]';
    }

    const elementTypes = value.map((item, i) =>
      inferType(item, `${name}Item`, interfaces)
    );
    const uniqueTypes = [...new Set(elementTypes)];

    if (uniqueTypes.length === 1) {
      return `${uniqueTypes[0]}[]`;
    }
    return `(${uniqueTypes.join(' | ')})[]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return 'Record<string, unknown>';
    }

    const interfaceName = toPascalCase(name);
    const fields = entries.map(([key, val]) => {
      const fieldType = inferType(val, key, interfaces);
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

      if (val === null) {
        return `  ${safeKey}: null;`;
      }
      return `  ${safeKey}: ${fieldType};`;
    });

    const interfaceStr = `interface ${interfaceName} {\n${fields.join('\n')}\n}`;
    interfaces.set(interfaceName, interfaceStr);

    return interfaceName;
  }

  switch (typeof value) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    default:
      return 'unknown';
  }
}

function generateTypes(json: unknown, rootName: string): string {
  const interfaces = new Map<string, string>();

  inferType(json, rootName, interfaces);

  if (interfaces.size === 0) {
    const simpleType = inferType(json, rootName, interfaces);
    return `type ${toPascalCase(rootName)} = ${simpleType};`;
  }

  const result: string[] = [];
  const entries = [...interfaces.entries()];

  for (let i = entries.length - 1; i >= 0; i--) {
    result.push(entries[i][1]);
  }

  return result.join('\n\n');
}

export default function JsonToTypescript() {
  const [input, setInput] = useState('');
  const [rootName, setRootName] = useState('Root');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleGenerate() {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON to convert.');
      return;
    }

    const name = rootName.trim() || 'Root';

    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch {
      setError('Invalid JSON. Please check the syntax.');
      return;
    }

    try {
      const result = generateTypes(parsed, name);
      setOutput(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to generate TypeScript types.'
      );
    }
  }

  function handleLoadSample() {
    setInput(SAMPLE_JSON);
    setRootName('Root');
    setOutput('');
    setError('');
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">JSON Input</label>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Load Sample
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here..."
          className="min-h-40 font-mono text-xs"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground whitespace-nowrap">
            Root interface name
          </label>
          <Input
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            placeholder="Root"
            className="w-40 font-mono text-sm"
          />
        </div>
        <Button onClick={handleGenerate}>Generate</Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {output && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>TypeScript Types</CardTitle>
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
