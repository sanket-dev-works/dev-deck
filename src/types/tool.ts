export type ToolCategory =
  | 'data-tools'
  | 'auth-security'
  | 'text-string'
  | 'date-time'
  | 'code-tools'
  | 'generators';

/**
 * Static definition for a DevDeck utility. The React implementation is registered
 * separately in `config/toolRegistry.tsx` (lazy-loaded by slug) to avoid coupling
 * config data to heavy client bundles.
 */
export interface Tool {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ToolCategory;
  icon: string;
  keywords: string[];
  privacyLevel: 'local';
  /** Optional sample payload for “Load sample” actions in tool UIs */
  sampleInput?: string;
}
