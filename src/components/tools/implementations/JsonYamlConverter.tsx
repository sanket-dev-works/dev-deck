'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { parse as yamlParse, stringify as yamlStringify } from 'yaml';

const SAMPLE_JSON = '{"apiVersion":"v1","kind":"Service","metadata":{"name":"my-app","labels":{"app":"web"}},"spec":{"selector":{"app":"web"},"ports":[{"port":80,"targetPort":3000}]}}';

const SAMPLE_YAML = `apiVersion: v1
kind: Service
metadata:
  name: my-app
  labels:
    app: web
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 3000
`;

type Direction = 'json-to-yaml' | 'yaml-to-json';

export default function JsonYamlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<Direction>('json-to-yaml');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<number>(2);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      if (direction === 'json-to-yaml') {
        const parsed = JSON.parse(input);
        const result = yamlStringify(parsed, { indent });
        setOutput(result);
        setError('');
      } else {
        const parsed = yamlParse(input);
        const result = JSON.stringify(parsed, null, indent);
        setOutput(result);
        setError('');
      }
    } catch (e) {
      setOutput('');
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  }, [input, direction, indent]);

  function handleSample() {
    if (direction === 'json-to-yaml') {
      setInput(SAMPLE_JSON);
    } else {
      setInput(SAMPLE_YAML);
    }
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setError('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setDirection('json-to-yaml')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              direction === 'json-to-yaml'
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            JSON &rarr; YAML
          </button>
          <button
            onClick={() => setDirection('yaml-to-json')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              direction === 'yaml-to-json'
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            YAML &rarr; JSON
          </button>
        </div>

        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setIndent(2)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              indent === 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            2-space
          </button>
          <button
            onClick={() => setIndent(4)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              indent === 4
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            4-space
          </button>
        </div>

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
            {direction === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === 'json-to-yaml'
                ? 'Paste your JSON here...'
                : 'Paste your YAML here...'
            }
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              {direction === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}
            </label>
            <CopyButton text={output} label="Copy" size="sm" variant="ghost" />
          </div>
          <Card className="min-h-[300px]">
            <CardContent>
              <pre className="font-mono text-sm whitespace-pre-wrap break-all text-foreground">
                {output || (
                  <span className="text-muted-foreground">
                    Converted output will appear here...
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
