export const SITE_NAME = 'Science News 360 — Global Science, Education & Innovation';
export const DEFAULT_SITE_URL = 'https://sciencenews360.com';

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' ? url.origin : DEFAULT_SITE_URL;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function absoluteUrl(pathOrUrl: string, siteUrl = getSiteUrl()) {
  if (!pathOrUrl) return siteUrl;
  try {
    const parsed = new URL(pathOrUrl);
    return parsed.toString();
  } catch {
    return new URL(pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`, siteUrl).toString();
  }
}

export function isPublicHttpsImage(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !['localhost', '127.0.0.1', '0.0.0.0'].includes(url.hostname);
  } catch {
    return false;
  }
}

export function canonicalArticleUrl(locale: 'id' | 'en', slug: string) {
  return absoluteUrl(`/${locale}/article/${encodeURIComponent(slug)}`);
}

export function socialImageUrl(locale: 'id' | 'en', slug: string, preferred?: string) {
  if (isPublicHttpsImage(preferred)) return preferred as string;
  return absoluteUrl(`/${locale}/article/${encodeURIComponent(slug)}/opengraph-image`);
}

export function cleanSocialText(value: string, max: number) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}
