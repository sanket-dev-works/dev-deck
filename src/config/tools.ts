import { Tool } from '@/types/tool';

/** Curated picks for the homepage — high-traffic, broadly useful utilities */
export const POPULAR_TOOL_SLUGS = [
  'json-formatter',
  'jwt-decoder',
  'base64-encode-decode',
  'regex-tester',
  'uuid-generator',
  'timestamp-converter',
] as const;

export const tools: Tool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and minify JSON data instantly with a clean developer-friendly interface.',
    shortDescription: 'Format and validate JSON',
    category: 'data-tools',
    icon: 'Braces',
    keywords: ['json', 'format', 'validate', 'beautify', 'minify', 'pretty print', 'prettify'],
    privacyLevel: 'local',
    sampleInput: '{"name":"DevDeck","version":1,"tools":["json","jwt","regex"],"config":{"theme":"dark","language":"en"},"tags":[{"id":1,"label":"dev"},{"id":2,"label":"utils"}]}',
  },
  {
    slug: 'json-to-typescript',
    name: 'JSON to TypeScript Types',
    description: 'Generate TypeScript interface definitions from JSON input automatically.',
    shortDescription: 'Generate TS types from JSON',
    category: 'code-tools',
    icon: 'FileCode',
    keywords: ['json', 'typescript', 'types', 'interface', 'ts', 'generate', 'convert'],
    privacyLevel: 'local',
    sampleInput: '{"id":1,"name":"John Doe","email":"john@example.com","isActive":true,"roles":["admin","user"],"address":{"street":"123 Main St","city":"Springfield","zip":"62701"}}',
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode JWT tokens to inspect header and payload without verifying the signature.',
    shortDescription: 'Decode JWT tokens',
    category: 'auth-security',
    icon: 'KeyRound',
    keywords: ['jwt', 'json web token', 'decode', 'token', 'auth', 'authentication', 'bearer'],
    privacyLevel: 'local',
    sampleInput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions against sample text with real-time highlighting and match details.',
    shortDescription: 'Test regex patterns',
    category: 'code-tools',
    icon: 'Regex',
    keywords: ['regex', 'regular expression', 'pattern', 'match', 'test', 'regexp'],
    privacyLevel: 'local',
  },
  {
    slug: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates in multiple formats.',
    shortDescription: 'Convert timestamps & dates',
    category: 'date-time',
    icon: 'Clock',
    keywords: ['timestamp', 'unix', 'epoch', 'date', 'time', 'convert', 'utc', 'iso'],
    privacyLevel: 'local',
  },
  {
    slug: 'base64-encode-decode',
    name: 'Base64 Encode / Decode',
    description: 'Encode plain text to Base64 and decode Base64 back to text with full UTF-8 support.',
    shortDescription: 'Encode & decode Base64',
    category: 'text-string',
    icon: 'Binary',
    keywords: ['base64', 'encode', 'decode', 'binary', 'text', 'convert'],
    privacyLevel: 'local',
    sampleInput: 'Hello, DevDeck! This is a sample text with special chars: @#$% and unicode: cafe\u0301',
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUIDs (v4) instantly for development and testing purposes.',
    shortDescription: 'Generate random UUIDs',
    category: 'generators',
    icon: 'Fingerprint',
    keywords: ['uuid', 'guid', 'generate', 'random', 'unique', 'identifier', 'v4'],
    privacyLevel: 'local',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Transform text between camelCase, PascalCase, snake_case, kebab-case, and more.',
    shortDescription: 'Convert text casing',
    category: 'text-string',
    icon: 'CaseSensitive',
    keywords: ['case', 'convert', 'camel', 'pascal', 'snake', 'kebab', 'upper', 'lower', 'title'],
    privacyLevel: 'local',
    sampleInput: 'hello world example text',
  },
  {
    slug: 'json-diff-checker',
    name: 'JSON Diff Checker',
    description: 'Compare two JSON objects and visualize the differences with color-coded results.',
    shortDescription: 'Compare JSON objects',
    category: 'data-tools',
    icon: 'GitCompare',
    keywords: ['json', 'diff', 'compare', 'difference', 'merge', 'check'],
    privacyLevel: 'local',
  },
  {
    slug: 'csv-to-json',
    name: 'CSV to JSON Converter',
    description: 'Convert CSV data into formatted JSON arrays with configurable parsing options.',
    shortDescription: 'Convert CSV to JSON',
    category: 'data-tools',
    icon: 'Table',
    keywords: ['csv', 'json', 'convert', 'table', 'spreadsheet', 'data', 'parse'],
    privacyLevel: 'local',
    sampleInput: 'name,age,email,city\nAlice,30,alice@example.com,New York\nBob,25,bob@example.com,San Francisco\nCharlie,35,charlie@example.com,Chicago',
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text input using the Web Crypto API.',
    shortDescription: 'Generate text hashes',
    category: 'auth-security',
    icon: 'Hash',
    keywords: ['hash', 'sha', 'sha256', 'sha512', 'sha1', 'checksum', 'digest', 'crypto'],
    privacyLevel: 'local',
    sampleInput: 'Hello, World!',
  },
  {
    slug: 'url-encode-decode',
    name: 'URL Encoder / Decoder',
    description: 'Encode and decode URL components, with full URL parsing into protocol, host, path, query params, and fragment.',
    shortDescription: 'Encode & decode URLs',
    category: 'text-string',
    icon: 'Link',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent', 'query', 'params', 'parse'],
    privacyLevel: 'local',
    sampleInput: 'https://example.com/search?q=hello world&lang=en&sort=relevance#results',
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, and HSL formats with a live color preview swatch.',
    shortDescription: 'Convert color formats',
    category: 'code-tools',
    icon: 'Palette',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'convert', 'css', 'palette', 'picker'],
    privacyLevel: 'local',
    sampleInput: '#3B82F6',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text in paragraphs, sentences, or words with configurable length.',
    shortDescription: 'Generate placeholder text',
    category: 'generators',
    icon: 'FileText',
    keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy', 'filler', 'generate'],
    privacyLevel: 'local',
  },
  {
    slug: 'json-yaml-converter',
    name: 'JSON ↔ YAML Converter',
    description: 'Convert between JSON and YAML formats bidirectionally with proper formatting.',
    shortDescription: 'Convert JSON & YAML',
    category: 'data-tools',
    icon: 'Braces',
    keywords: ['json', 'yaml', 'yml', 'convert', 'kubernetes', 'docker', 'config', 'k8s'],
    privacyLevel: 'local',
    sampleInput: '{"apiVersion":"v1","kind":"Service","metadata":{"name":"my-app","labels":{"app":"web"}},"spec":{"selector":{"app":"web"},"ports":[{"port":80,"targetPort":3000}]}}',
  },
  {
    slug: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Write Markdown and see a live rendered preview side-by-side with GFM support.',
    shortDescription: 'Preview Markdown live',
    category: 'code-tools',
    icon: 'PenTool',
    keywords: ['markdown', 'md', 'preview', 'render', 'github', 'readme', 'gfm', 'markup'],
    privacyLevel: 'local',
    sampleInput: '# Hello World\n\nThis is **bold** and *italic* text.\n\n## Features\n\n- Item one\n- Item two\n- Item three\n\n```javascript\nconsole.log("Hello!");\n```\n\n> A blockquote for emphasis.\n\n| Name | Role |\n|------|------|\n| Alice | Dev |\n| Bob | Design |',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries with proper indentation, keyword uppercasing, and readability improvements.',
    shortDescription: 'Beautify SQL queries',
    category: 'code-tools',
    icon: 'Database',
    keywords: ['sql', 'format', 'beautify', 'query', 'mysql', 'postgres', 'sqlite', 'indent'],
    privacyLevel: 'local',
    sampleInput: 'select u.id, u.name, u.email, o.id as order_id, o.total, o.created_at from users u inner join orders o on u.id = o.user_id left join payments p on o.id = p.order_id where u.active = true and o.total > 100 and o.created_at >= \'2024-01-01\' group by u.id, u.name, u.email, o.id, o.total, o.created_at having count(p.id) > 0 order by o.total desc limit 50',
  },
  {
    slug: 'placeholder-image-generator',
    name: 'Placeholder Image Generator',
    description: 'Generate placeholder images with custom dimensions, colors, and text using the Canvas API.',
    shortDescription: 'Generate placeholder images',
    category: 'generators',
    icon: 'Image',
    keywords: ['placeholder', 'image', 'generate', 'canvas', 'dimensions', 'avatar', 'thumbnail', 'banner'],
    privacyLevel: 'local',
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getPopularTools(): Tool[] {
  return POPULAR_TOOL_SLUGS.map((slug) => getToolBySlug(slug)).filter(
    (t): t is Tool => t !== undefined
  );
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function searchTools(query: string): Tool[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(lower) ||
      t.keywords.some((k) => k.includes(lower)) ||
      t.shortDescription.toLowerCase().includes(lower)
  );
}
