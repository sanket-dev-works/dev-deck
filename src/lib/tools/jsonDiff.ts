export interface DiffEntry {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue?: unknown;
  newValue?: unknown;
}

export function compareJson(
  left: unknown,
  right: unknown,
  path: string = ''
): DiffEntry[] {
  const diffs: DiffEntry[] = [];

  if (left === right) return diffs;

  if (
    left === null ||
    right === null ||
    typeof left !== typeof right ||
    typeof left !== 'object' ||
    Array.isArray(left) !== Array.isArray(right)
  ) {
    diffs.push({
      path: path || '(root)',
      type: 'changed',
      oldValue: left,
      newValue: right,
    });
    return diffs;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const maxLen = Math.max(left.length, right.length);
    for (let i = 0; i < maxLen; i++) {
      const itemPath = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= left.length) {
        diffs.push({ path: itemPath, type: 'added', newValue: right[i] });
      } else if (i >= right.length) {
        diffs.push({ path: itemPath, type: 'removed', oldValue: left[i] });
      } else {
        diffs.push(...compareJson(left[i], right[i], itemPath));
      }
    }
    return diffs;
  }

  const leftObj = left as Record<string, unknown>;
  const rightObj = right as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);

  for (const key of allKeys) {
    const keyPath = path ? `${path}.${key}` : key;
    if (!(key in leftObj)) {
      diffs.push({ path: keyPath, type: 'added', newValue: rightObj[key] });
    } else if (!(key in rightObj)) {
      diffs.push({ path: keyPath, type: 'removed', oldValue: leftObj[key] });
    } else {
      diffs.push(...compareJson(leftObj[key], rightObj[key], keyPath));
    }
  }

  return diffs;
}

export function formatDiffValue(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`;
  if (value === null) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function buildDiffSummary(diffs: DiffEntry[]): string {
  return diffs
    .map((d) => {
      switch (d.type) {
        case 'added':
          return `+ ${d.path}: ${formatDiffValue(d.newValue)}`;
        case 'removed':
          return `- ${d.path}: ${formatDiffValue(d.oldValue)}`;
        case 'changed':
          return `~ ${d.path}: ${formatDiffValue(d.oldValue)} -> ${formatDiffValue(d.newValue)}`;
      }
    })
    .join('\n');
}
