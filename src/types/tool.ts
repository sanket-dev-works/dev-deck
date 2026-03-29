export type ToolCategory =
  | 'data-tools'
  | 'auth-security'
  | 'text-string'
  | 'date-time'
  | 'code-tools'
  | 'generators';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ToolCategory;
  icon: string;
  keywords: string[];
  privacyLevel: 'local';
  sampleInput?: string;
}
