export function splitWords(input: string): string[] {
  if (!input.trim()) return [];
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_\-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function toCamelCase(words: string[]): string {
  if (words.length === 0) return '';
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join('');
}

function toPascalCaseWords(words: string[]): string {
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
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

export type CaseVariant = {
  label: string;
  convert: (words: string[]) => string;
};

export const CASE_VARIANTS: CaseVariant[] = [
  { label: 'camelCase', convert: toCamelCase },
  { label: 'PascalCase', convert: toPascalCaseWords },
  { label: 'snake_case', convert: toSnakeCase },
  { label: 'kebab-case', convert: toKebabCase },
  { label: 'UPPER_CASE', convert: toUpperCase },
  { label: 'lower case', convert: toLowerCaseSpaced },
  { label: 'Title Case', convert: toTitleCase },
];

export function computeCaseResults(input: string): { label: string; value: string }[] {
  const words = splitWords(input);
  return CASE_VARIANTS.map((c) => ({
    label: c.label,
    value: words.length > 0 ? c.convert(words) : '',
  }));
}
