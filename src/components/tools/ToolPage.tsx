'use client';

import dynamic from 'next/dynamic';
import { Tool } from '@/types/tool';
import { ToolLayout } from './ToolLayout';

const toolComponents: Record<string, React.ComponentType> = {
  'json-formatter': dynamic(() => import('./implementations/JsonFormatter')),
  'base64-encode-decode': dynamic(() => import('./implementations/Base64EncodeDecode')),
  'uuid-generator': dynamic(() => import('./implementations/UuidGenerator')),
  'case-converter': dynamic(() => import('./implementations/CaseConverter')),
  'timestamp-converter': dynamic(() => import('./implementations/TimestampConverter')),
  'jwt-decoder': dynamic(() => import('./implementations/JwtDecoder')),
  'csv-to-json': dynamic(() => import('./implementations/CsvToJson')),
  'json-diff-checker': dynamic(() => import('./implementations/JsonDiffChecker')),
  'regex-tester': dynamic(() => import('./implementations/RegexTester')),
  'json-to-typescript': dynamic(() => import('./implementations/JsonToTypescript')),
  'hash-generator': dynamic(() => import('./implementations/HashGenerator')),
  'url-encode-decode': dynamic(() => import('./implementations/UrlEncodeDecode')),
  'color-converter': dynamic(() => import('./implementations/ColorConverter')),
  'lorem-ipsum-generator': dynamic(() => import('./implementations/LoremIpsumGenerator')),
  'json-yaml-converter': dynamic(() => import('./implementations/JsonYamlConverter')),
  'markdown-preview': dynamic(() => import('./implementations/MarkdownPreview')),
  'sql-formatter': dynamic(() => import('./implementations/SqlFormatter')),
  'placeholder-image-generator': dynamic(() => import('./implementations/PlaceholderImageGenerator')),
};

export function ToolPage({ tool }: { tool: Tool }) {
  const ToolComponent = toolComponents[tool.slug];

  if (!ToolComponent) {
    return (
      <ToolLayout tool={tool}>
        <div className="text-center py-12 text-muted-foreground">
          This tool is coming soon.
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout tool={tool}>
      <ToolComponent />
    </ToolLayout>
  );
}
