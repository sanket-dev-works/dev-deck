'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const SAMPLE_MARKDOWN = `# Hello World

This is **bold** and *italic* text.

## Features

- Item one
- Item two
- Item three

\`\`\`javascript
console.log("Hello!");
\`\`\`

> A blockquote for emphasis.

| Name | Role |
|------|------|
| Alice | Dev |
| Bob | Design |`;

function markdownToHtml(md: string): string {
  if (!md.trim()) return '';

  // Store code blocks to protect them from further processing
  const codeBlocks: string[] = [];
  let result = md;

  // 1. Code blocks: ```...``` -> <pre><code>...</code></pre>
  result = result.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    const index = codeBlocks.length;
    codeBlocks.push(`<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
    return `%%CODEBLOCK_${index}%%`;
  });

  // 2. Headings
  result = result.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
  result = result.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
  result = result.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  result = result.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  result = result.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  result = result.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // 11. Horizontal rules (before list processing)
  result = result.replace(/^(---|\*\*\*)$/gm, '<hr>');

  // 12. Tables
  result = result.replace(
    /(?:^|\n)((?:\|[^\n]+\|\n)\|[-| :]+\|\n(?:\|[^\n]+\|\n?)*)/g,
    (_match, table: string) => {
      const rows = table.trim().split('\n');
      if (rows.length < 2) return _match;

      const headerCells = rows[0]
        .split('|')
        .filter((c) => c.trim() !== '')
        .map((c) => `<th>${c.trim()}</th>`)
        .join('');

      const bodyRows = rows.slice(2).map((row) => {
        const cells = row
          .split('|')
          .filter((c) => c.trim() !== '')
          .map((c) => `<td>${c.trim()}</td>`)
          .join('');
        return `<tr>${cells}</tr>`;
      });

      return `\n<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows.join('')}</tbody></table>\n`;
    }
  );

  // 10. Blockquotes
  result = result.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  // Merge adjacent blockquotes
  result = result.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // 8. Unordered lists
  result = result.replace(/((?:^[-*] .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split('\n')
      .map((line) => `<li>${line.replace(/^[-*] /, '')}</li>`)
      .join('');
    return `<ul>${items}</ul>\n`;
  });

  // 9. Ordered lists
  result = result.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split('\n')
      .map((line) => `<li>${line.replace(/^\d+\. /, '')}</li>`)
      .join('');
    return `<ol>${items}</ol>\n`;
  });

  // 3. Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // 4. Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.+?)_/g, '<em>$1</em>');

  // 5. Inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 6. Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 7. Images
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // 13 & 14. Paragraphs: wrap remaining text blocks
  const lines = result.split('\n');
  const processed: string[] = [];
  let paragraphBuffer: string[] = [];

  function flushParagraph() {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ').trim();
      if (text) {
        processed.push(`<p>${text}</p>`);
      }
      paragraphBuffer = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      flushParagraph();
    } else if (
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('<hr') ||
      trimmed.startsWith('<table') ||
      trimmed.startsWith('<pre') ||
      trimmed.startsWith('%%CODEBLOCK_')
    ) {
      flushParagraph();
      processed.push(trimmed);
    } else {
      paragraphBuffer.push(trimmed);
    }
  }
  flushParagraph();

  result = processed.join('\n');

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    result = result.replace(`%%CODEBLOCK_${index}%%`, block);
  });

  // XSS protection
  result = result.replace(/<script/gi, '&lt;script');
  result = result.replace(/<iframe/gi, '&lt;iframe');
  result = result.replace(/on\w+=/gi, '');
  result = result.replace(/javascript:/gi, '');

  return result;
}

export default function MarkdownPreview() {
  const [input, setInput] = useState('');

  const html = markdownToHtml(input);

  function handleSample() {
    setInput(SAMPLE_MARKDOWN);
  }

  function handleClear() {
    setInput('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSample} variant="outline" size="sm">
          Sample Data
        </Button>
        <Button onClick={handleClear} variant="ghost" size="sm">
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Markdown</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your markdown here..."
            className="min-h-[400px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Preview</label>
          <Card className="min-h-[400px]">
            <CardContent>
              {html ? (
                <div
                  className={`
                    text-foreground
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6
                    [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4
                    [&_p]:mb-3 [&_p]:leading-relaxed
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
                    [&_li]:mb-1
                    [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:mb-3
                    [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                    [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0
                    [&_a]:text-primary [&_a]:underline
                    [&_hr]:border-border [&_hr]:my-6
                    [&_table]:w-full [&_table]:border-collapse [&_table]:mb-3
                    [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-1.5 [&_th]:bg-muted [&_th]:text-left [&_th]:font-semibold
                    [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5
                    [&_img]:max-w-full [&_img]:rounded
                    [&_strong]:font-bold
                    [&_em]:italic
                  `}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <p className="text-muted-foreground text-sm">
                  Rendered preview will appear here...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
