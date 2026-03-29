import { MetadataRoute } from 'next';
import { tools } from '@/config/tools';

const BASE_URL = 'https://devdeck.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...toolRoutes,
  ];
}
