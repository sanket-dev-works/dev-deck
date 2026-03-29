'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import {
  buildHighlightedHtml,
  findRegexMatches,
} from '@/lib/tools/regexTester';

const SAMPLE_PATTERN = String.raw`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b`;
const SAMPLE_TEXT = `Contact us at support@example.com for help.
Send invoices to billing@company.org or admin@company.org.
Invalid emails: @missing.com, noatsign.com, incomplete@
Personal: john.doe+tag@gmail.com, jane_smith@yahoo.co.uk`;

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState<Record<string, boolean>>({
    g: true,
    i: false,
    m: false,
    s: false,
  });

  const flagString = Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag)
    .join('');

  const { matches, error: regexError } = useMemo(() => {
    if (!pattern) return { matches: [], error: '' };
    return findRegexMatches(pattern, flagString, testString);
  }, [pattern, flagString, testString]);

  const highlightedHtml = useMemo(() => {
    if (!pattern || regexError || matches.length === 0) return '';
    return buildHighlightedHtml(testString, matches);
  }, [pattern, regexError, matches, testString]);

  function handleLoadSample() {
    setPattern(SAMPLE_PATTERN);
    setTestString(SAMPLE_TEXT);
    setFlags({ g: true, i: false, m: true, s: false });
  }

  function toggleFlag(flag: string) {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Regex pattern</span>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Load sample
          </Button>
        </div>
        <Input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Enter regex pattern…"
          className="font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs text-muted-foreground">Flags:</span>
        {['g', 'i', 'm', 's'].map((flag) => (
          <Button
            key={flag}
            variant={flags[flag] ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleFlag(flag)}
            className="h-7 w-8 font-mono text-xs"
          >
            {flag}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Test string</span>
        <Textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against…"
          className="min-h-32 font-mono text-xs"
        />
      </div>

      {regexError && <ErrorMessage message={regexError} />}

      {pattern && testString && !regexError && (
        <div className="space-y-4">
          {highlightedHtml && (
            <Card>
              <CardHeader>
                <CardTitle>Highlighted matches</CardTitle>
              </CardHeader>
              <CardContent>
                <pre
                  className="overflow-auto rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap text-foreground"
                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>
                {matches.length === 0
                  ? 'No matches'
                  : `${matches.length} match${matches.length !== 1 ? 'es' : ''}`}
              </CardTitle>
              {matches.length > 0 && (
                <CopyButton text={matches.map((m) => m.text).join('\n')} />
              )}
            </CardHeader>
            <CardContent>
              {matches.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No matches for this pattern and test string.
                </p>
              ) : (
                <div className="max-h-64 space-y-1.5 overflow-auto">
                  {matches.map((match, idx) => (
                    <div
                      key={`${match.index}-${idx}`}
                      className="flex items-start gap-3 rounded-md bg-muted px-3 py-2 font-mono text-xs"
                    >
                      <span className="shrink-0 text-muted-foreground">#{idx + 1}</span>
                      <span className="shrink-0 text-muted-foreground">@{match.index}</span>
                      <span className="break-all text-foreground">{match.text}</span>
                      {match.groups.length > 0 && (
                        <span className="text-muted-foreground">
                          groups: [{match.groups.map((g) => `"${g}"`).join(', ')}]
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
