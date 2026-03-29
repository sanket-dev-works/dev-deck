'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const SAMPLE_SQL =
  "select u.id, u.name, u.email, o.id as order_id, o.total, o.created_at from users u inner join orders o on u.id = o.user_id left join payments p on o.id = p.order_id where u.active = true and o.total > 100 and o.created_at >= '2024-01-01' group by u.id, u.name, u.email, o.id, o.total, o.created_at having count(p.id) > 0 order by o.total desc limit 50";

interface Token {
  type:
    | 'keyword'
    | 'identifier'
    | 'string'
    | 'number'
    | 'operator'
    | 'paren'
    | 'comma'
    | 'whitespace'
    | 'comment';
  value: string;
}

const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
  'FULL JOIN', 'CROSS JOIN', 'JOIN', 'ON', 'AND', 'OR', 'NOT', 'IN',
  'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'AS', 'CASE', 'WHEN',
  'THEN', 'ELSE', 'END', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'GROUP BY',
  'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT',
  'TOP', 'ASC', 'DESC', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CAST',
  'COALESCE', 'TRUE', 'FALSE',
];

// Multi-word keywords sorted by length descending for greedy matching
const MULTI_WORD_KEYWORDS = KEYWORDS.filter((k) => k.includes(' ')).sort(
  (a, b) => b.length - a.length
);

function tokenizeSql(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < sql.length) {
    // Whitespace
    const wsMatch = sql.slice(i).match(/^\s+/);
    if (wsMatch) {
      tokens.push({ type: 'whitespace', value: wsMatch[0] });
      i += wsMatch[0].length;
      continue;
    }

    // Single-line comment
    if (sql.slice(i, i + 2) === '--') {
      const end = sql.indexOf('\n', i);
      const comment = end === -1 ? sql.slice(i) : sql.slice(i, end);
      tokens.push({ type: 'comment', value: comment });
      i += comment.length;
      continue;
    }

    // String literals
    if (sql[i] === "'") {
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === "'" && sql[j + 1] === "'") {
          j += 2;
        } else if (sql[j] === "'") {
          j++;
          break;
        } else {
          j++;
        }
      }
      tokens.push({ type: 'string', value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Parentheses
    if (sql[i] === '(' || sql[i] === ')') {
      tokens.push({ type: 'paren', value: sql[i] });
      i++;
      continue;
    }

    // Comma
    if (sql[i] === ',') {
      tokens.push({ type: 'comma', value: ',' });
      i++;
      continue;
    }

    // Operators
    const opMatch = sql.slice(i).match(/^(>=|<=|<>|!=|[=<>+\-*/])/);
    if (opMatch) {
      tokens.push({ type: 'operator', value: opMatch[0] });
      i += opMatch[0].length;
      continue;
    }

    // Numbers
    const numMatch = sql.slice(i).match(/^\d+(\.\d+)?/);
    if (numMatch) {
      tokens.push({ type: 'number', value: numMatch[0] });
      i += numMatch[0].length;
      continue;
    }

    // Identifiers / keywords — check multi-word keywords first
    const idMatch = sql.slice(i).match(/^[a-zA-Z_]\w*(\.\w+)*/);
    if (idMatch) {
      // Check multi-word keywords
      let found = false;
      for (const mwk of MULTI_WORD_KEYWORDS) {
        const chunk = sql.slice(i, i + mwk.length);
        if (chunk.toUpperCase() === mwk) {
          // Make sure the next char after the keyword is not a word char
          const nextChar = sql[i + mwk.length];
          if (!nextChar || /\W/.test(nextChar)) {
            tokens.push({ type: 'keyword', value: chunk });
            i += mwk.length;
            found = true;
            break;
          }
        }
      }
      if (found) continue;

      const word = idMatch[0];
      const isKeyword = KEYWORDS.some(
        (k) => !k.includes(' ') && k === word.toUpperCase()
      );
      tokens.push({
        type: isKeyword ? 'keyword' : 'identifier',
        value: word,
      });
      i += word.length;
      continue;
    }

    // Fallback: single char
    tokens.push({ type: 'identifier', value: sql[i] });
    i++;
  }

  return tokens;
}

const MAJOR_CLAUSES = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN',
  'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'GROUP BY', 'ORDER BY',
  'HAVING', 'LIMIT', 'SET', 'VALUES', 'INTO', 'ON',
];

function formatSql(
  tokens: Token[],
  indentSize: number,
  uppercase: boolean
): string {
  const indent = (level: number) => ' '.repeat(level * indentSize);
  let result = '';
  let depth = 0;
  let inSelect = false;

  // Filter out whitespace tokens — we control spacing ourselves
  const meaningful = tokens.filter((t) => t.type !== 'whitespace');

  for (let i = 0; i < meaningful.length; i++) {
    const token = meaningful[i];
    const tokenUpper = token.value.toUpperCase();

    if (token.type === 'keyword') {
      const kwDisplay = uppercase ? tokenUpper : token.value;

      if (MAJOR_CLAUSES.includes(tokenUpper)) {
        if (tokenUpper === 'SELECT') {
          inSelect = true;
          if (result.trim()) result += '\n';
          result += indent(depth) + kwDisplay;
        } else if (tokenUpper === 'ON') {
          result += '\n' + indent(depth + 1) + kwDisplay;
          inSelect = false;
        } else {
          inSelect = false;
          result += '\n' + indent(depth) + kwDisplay;
        }
      } else if (tokenUpper === 'AND' || tokenUpper === 'OR') {
        result += '\n' + indent(depth + 1) + kwDisplay;
      } else {
        result += ' ' + kwDisplay;
      }
    } else if (token.type === 'paren') {
      if (token.value === '(') {
        result += ' (';
        depth++;
      } else {
        depth = Math.max(0, depth - 1);
        result += '\n' + indent(depth) + ')';
      }
    } else if (token.type === 'comma') {
      if (inSelect) {
        result += ',\n' + indent(depth + 1);
      } else {
        result += ',';
      }
    } else if (token.type === 'comment') {
      result += ' ' + token.value;
    } else {
      // identifier, string, number, operator
      result += ' ' + token.value;
    }
  }

  return result.trim();
}

function minifySql(tokens: Token[]): string {
  return tokens
    .filter((t) => t.type !== 'whitespace' && t.type !== 'comment')
    .map((t) => t.value)
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .trim();
}

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [uppercase, setUppercase] = useState(true);
  const [indentSize, setIndentSize] = useState<number>(2);

  function handleFormat() {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const tokens = tokenizeSql(input);
      const formatted = formatSql(tokens, indentSize, uppercase);
      setOutput(formatted);
      setError('');
    } catch (e) {
      setOutput('');
      setError(e instanceof Error ? e.message : 'Failed to format SQL');
    }
  }

  function handleMinify() {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const tokens = tokenizeSql(input);
      const minified = minifySql(tokens);
      setOutput(minified);
      setError('');
    } catch (e) {
      setOutput('');
      setError(e instanceof Error ? e.message : 'Failed to minify SQL');
    }
  }

  function handleSample() {
    setInput(SAMPLE_SQL);
    setError('');
    // Auto-format the sample
    const tokens = tokenizeSql(SAMPLE_SQL);
    const formatted = formatSql(tokens, indentSize, uppercase);
    setOutput(formatted);
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setError('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Button onClick={handleFormat} variant="secondary" size="sm">
          Format
        </Button>
        <Button onClick={handleMinify} variant="secondary" size="sm">
          Minify
        </Button>

        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setIndentSize(2)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              indentSize === 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            2-space
          </button>
          <button
            onClick={() => setIndentSize(4)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              indentSize === 4
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            4-space
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="uppercase"
            checked={uppercase}
            onCheckedChange={setUppercase}
          />
          <Label htmlFor="uppercase" className="text-sm">
            Uppercase Keywords
          </Label>
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
          <label className="text-sm font-medium text-muted-foreground">Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL query here..."
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Output</label>
            <CopyButton text={output} label="Copy" size="sm" variant="ghost" />
          </div>
          <Card className="min-h-[300px]">
            <CardContent>
              <pre className="font-mono text-sm whitespace-pre-wrap break-all text-foreground">
                {output || (
                  <span className="text-muted-foreground">
                    Formatted SQL will appear here...
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
