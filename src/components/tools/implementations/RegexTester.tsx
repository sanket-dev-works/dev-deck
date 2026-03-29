'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';

const SAMPLE_PATTERN = String.raw`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b`;
const SAMPLE_TEXT = `Contact us at support@example.com for help.
Send invoices to billing@company.org or admin@company.org.
Invalid emails: @missing.com, noatsign.com, incomplete@
Personal: john.doe+tag@gmail.com, jane_smith@yahoo.co.uk`;

interface MatchResult {
  index: number;
  text: string;
  groups: string[];
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

  const { regex, regexError } = useMemo(() => {
    if (!pattern) return { regex: null, regexError: '' };
    try {
      const flagsWithGlobal = flagString.includes('g') ? flagString : flagString + 'g';
      return { regex: new RegExp(pattern, flagsWithGlobal), regexError: '' };
    } catch (e) {
      return {
        regex: null,
        regexError: e instanceof Error ? e.message : 'Invalid regular expression.',
      };
    }
  }, [pattern, flagString]);

  const matches: MatchResult[] = useMemo(() => {
    if (!regex || !testString) return [];
    const results: MatchResult[] = [];
    let match: RegExpExecArray | null;

    const re = new RegExp(regex.source, regex.flags);
    while ((match = re.exec(testString)) !== null) {
      results.push({
        index: match.index,
        text: match[0],
        groups: match.slice(1),
      });
      if (match[0].length === 0) {
        re.lastIndex++;
      }
      if (results.length > 500) break;
    }
    return results;
  }, [regex, testString]);

  const highlightedHtml = useMemo(() => {
    if (!regex || !testString || matches.length === 0) return '';

    const parts: string[] = [];
    let lastIndex = 0;

    for (const match of matches) {
      if (match.index > lastIndex) {
        parts.push(escapeHtml(testString.slice(lastIndex, match.index)));
      }
      parts.push(
        `<mark class="bg-yellow-400/30 text-yellow-200 rounded px-0.5">${escapeHtml(match.text)}</mark>`
      );
      lastIndex = match.index + match.text.length;
    }

    if (lastIndex < testString.length) {
      parts.push(escapeHtml(testString.slice(lastIndex)));
    }

    return parts.join('');
  }, [regex, testString, matches]);

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
          <label className="text-sm font-medium text-foreground">Regex Pattern</label>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Load Sample
          </Button>
        </div>
        <Input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Enter regex pattern..."
          className="font-mono text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground mr-1">Flags:</span>
        {['g', 'i', 'm', 's'].map((flag) => (
          <Button
            key={flag}
            variant={flags[flag] ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleFlag(flag)}
            className="w-8 h-7 text-xs font-mono"
          >
            {flag}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Test String</label>
        <Textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against..."
          className="min-h-32 font-mono text-xs"
        />
      </div>

      {regexError && <ErrorMessage message={regexError} />}

      {pattern && testString && !regexError && (
        <div className="space-y-4">
          {highlightedHtml && (
            <Card>
              <CardHeader>
                <CardTitle>Highlighted Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <pre
                  className="overflow-auto rounded-md bg-muted p-3 text-xs font-mono text-foreground whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>
                {matches.length === 0
                  ? 'No Matches'
                  : `${matches.length} Match${matches.length !== 1 ? 'es' : ''}`}
              </CardTitle>
              {matches.length > 0 && (
                <CopyButton
                  text={matches.map((m) => m.text).join('\n')}
                />
              )}
            </CardHeader>
            <CardContent>
              {matches.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No matches found for the given pattern and test string.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-64 overflow-auto">
                  {matches.map((match, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-md bg-muted px-3 py-2 text-xs font-mono"
                    >
                      <span className="text-muted-foreground shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="text-muted-foreground shrink-0">
                        @{match.index}
                      </span>
                      <span className="text-foreground break-all">
                        {match.text}
                      </span>
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
