import { Category } from '@/types/category';

export const categories: Category[] = [
  { slug: 'data-tools', name: 'Data Tools', description: 'Transform and validate data formats', icon: 'Database' },
  { slug: 'auth-security', name: 'Auth & Security', description: 'Authentication and security utilities', icon: 'Shield' },
  { slug: 'text-string', name: 'Text & String Tools', description: 'Text manipulation and conversion', icon: 'Type' },
  { slug: 'date-time', name: 'Date & Time', description: 'Date and time utilities', icon: 'Clock' },
  { slug: 'code-tools', name: 'Code Tools', description: 'Code generation and analysis', icon: 'Code' },
  { slug: 'generators', name: 'Generators', description: 'Generate useful values', icon: 'Sparkles' },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
