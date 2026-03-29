export interface RegexMatch {
  index: number;
  text: string;
  groups: string[];
}

export function findRegexMatches(
  pattern: string,
  flagString: string,
  testString: string,
  maxMatches = 500
): { matches: RegexMatch[]; error: string } {
  if (!pattern.trim()) {
    return { matches: [], error: '' };
  }

  let regex: RegExp;
  try {
    const flagsWithGlobal = flagString.includes('g') ? flagString : flagString + 'g';
    regex = new RegExp(pattern, flagsWithGlobal);
  } catch (e) {
    return {
      matches: [],
      error: e instanceof Error ? e.message : 'Invalid regular expression.',
    };
  }

  const results: RegexMatch[] = [];
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
    if (results.length >= maxMatches) break;
  }

  return { matches: results, error: '' };
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function buildHighlightedHtml(
  testString: string,
  matches: RegexMatch[]
): string {
  if (matches.length === 0) return '';

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
}
