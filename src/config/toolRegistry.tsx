'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Maps tool slugs (from `config/tools.ts`) to lazily loaded implementations.
 * Add a new entry here when you add a tool — keep `tools` config and this registry in sync.
 */
function loadTool(
  loader: () => Promise<{ default: ComponentType }>
): ComponentType {
  return dynamic(loader, { loading: () => null }) as ComponentType;
}

export const toolComponents: Record<string, ComponentType> = {
  'json-formatter': loadTool(() => import('@/components/tools/implementations/JsonFormatter')),
  'base64-encode-decode': loadTool(
    () => import('@/components/tools/implementations/Base64EncodeDecode')
  ),
  'uuid-generator': loadTool(() => import('@/components/tools/implementations/UuidGenerator')),
  'case-converter': loadTool(() => import('@/components/tools/implementations/CaseConverter')),
  'timestamp-converter': loadTool(
    () => import('@/components/tools/implementations/TimestampConverter')
  ),
  'jwt-decoder': loadTool(() => import('@/components/tools/implementations/JwtDecoder')),
  'csv-to-json': loadTool(() => import('@/components/tools/implementations/CsvToJson')),
  'json-diff-checker': loadTool(() => import('@/components/tools/implementations/JsonDiffChecker')),
  'regex-tester': loadTool(() => import('@/components/tools/implementations/RegexTester')),
  'json-to-typescript': loadTool(() => import('@/components/tools/implementations/JsonToTypescript')),
  'hash-generator': loadTool(() => import('@/components/tools/implementations/HashGenerator')),
  'url-encode-decode': loadTool(() => import('@/components/tools/implementations/UrlEncodeDecode')),
  'color-converter': loadTool(() => import('@/components/tools/implementations/ColorConverter')),
  'lorem-ipsum-generator': loadTool(
    () => import('@/components/tools/implementations/LoremIpsumGenerator')
  ),
  'json-yaml-converter': loadTool(() => import('@/components/tools/implementations/JsonYamlConverter')),
  'markdown-preview': loadTool(() => import('@/components/tools/implementations/MarkdownPreview')),
  'sql-formatter': loadTool(() => import('@/components/tools/implementations/SqlFormatter')),
  'placeholder-image-generator': loadTool(
    () => import('@/components/tools/implementations/PlaceholderImageGenerator')
  ),
};

export function getToolComponent(slug: string): ComponentType | undefined {
  return toolComponents[slug];
}
