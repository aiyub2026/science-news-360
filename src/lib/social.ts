export const SITE_NAME = 'Science News 360 — Global Science, Education & Innovation';
export const DEFAULT_SITE_URL = 'https://sciencenews360.my.id';

export function getSiteUrl() {
  /*
   * Production canonical domain Science News 360.
   * Jangan biarkan NETLIFY_URL / deployment URL menjadi canonical publik.
   */
  if (process.env.NODE_ENV === 'production') return DEFAULT_SITE_URL;

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

export function normalizePublicUrl(value?: string) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (
      url.hostname.endsWith('.netlify.app') ||
      url.hostname === 'sciencenews360-my-id.netlify.app'
    ) {
      return absoluteUrl(`${url.pathname}${url.search}`);
    }
    return url.toString();
  } catch {
    return absoluteUrl(value);
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
  if (isPublicHttpsImage(preferred)) return normalizePublicUrl(preferred);
  return absoluteUrl(`/${locale}/article/${encodeURIComponent(slug)}/opengraph-image`);
}

export function cleanSocialText(value: string, max: number) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}
