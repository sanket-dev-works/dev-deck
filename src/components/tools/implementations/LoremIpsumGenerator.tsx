'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/tools/CopyButton';
import { Label } from '@/components/ui/label';

type Unit = 'paragraphs' | 'sentences' | 'words';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

const CLASSIC_FIRST_SENTENCE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(): string {
  const length = randomInt(8, 15);
  const words = Array.from({ length }, () => randomWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return `${words.join(' ')}.`;
}

function generateParagraph(): string {
  const sentenceCount = randomInt(4, 7);
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
}

function buildLoremOutput(count: number, unit: Unit, startWithLorem: boolean): string {
  if (unit === 'words') {
    const words = Array.from({ length: count }, () => randomWord());
    if (startWithLorem && count > 0) {
      const classicWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
      for (let i = 0; i < Math.min(classicWords.length, count); i++) {
        words[i] = classicWords[i];
      }
    } else if (count > 0) {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    return words.join(' ');
  }

  if (unit === 'sentences') {
    const sentences = Array.from({ length: count }, () => generateSentence());
    if (startWithLorem && count > 0) {
      sentences[0] = CLASSIC_FIRST_SENTENCE;
    }
    return sentences.join(' ');
  }

  const paragraphs = Array.from({ length: count }, () => generateParagraph());
  if (startWithLorem && count > 0) {
    const restOfParagraph = paragraphs[0].split('. ').slice(1).join('. ');
    paragraphs[0] = restOfParagraph
      ? `${CLASSIC_FIRST_SENTENCE} ${restOfParagraph}`
      : CLASSIC_FIRST_SENTENCE;
  }
  return paragraphs.join('\n\n');
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<Unit>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [regenKey, setRegenKey] = useState(0);

  const output = useMemo(() => {
    void regenKey;
    return buildLoremOutput(count, unit, startWithLorem);
  }, [count, unit, startWithLorem, regenKey]);

  const units: { value: Unit; label: string }[] = [
    { value: 'words', label: 'Words' },
    { value: 'sentences', label: 'Sentences' },
    { value: 'paragraphs', label: 'Paragraphs' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="count-input" className="text-sm font-medium text-muted-foreground">
            Count
          </Label>
          <Input
            id="count-input"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
            className="w-20 text-sm"
          />
        </div>

        <div className="flex overflow-hidden rounded-lg border border-border">
          {units.map((u) => (
            <button
              key={u.value}
              type="button"
              onClick={() => setUnit(u.value)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                unit === u.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="lorem-toggle"
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <Label htmlFor="lorem-toggle" className="cursor-pointer text-sm text-muted-foreground">
            Start with Lorem ipsum
          </Label>
        </div>

        <Button onClick={() => setRegenKey((k) => k + 1)} variant="secondary" size="sm">
          Regenerate
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">
            Output ({count} {unit})
          </label>
          <CopyButton text={output} label="Copy" size="sm" variant="ghost" />
        </div>
        <Card>
          <CardContent>
            <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {output || (
                <span className="text-muted-foreground">Generated text will appear here...</span>
              )}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
