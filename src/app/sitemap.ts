import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/social';
import { listPublishedArticles } from '@/lib/server-publications';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const articles = await listPublishedArticles();
  const now = new Date();

  return [
    { url: site, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${site}/id`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${site}/en`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${site}/id/authors`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${site}/en/authors`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...articles.map((article) => ({
      url: article.canonicalUrl,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];
}
