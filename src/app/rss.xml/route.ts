import { listPublishedArticles } from '@/lib/server-publications';
import { getSiteUrl, SITE_NAME } from '@/lib/social';

export const dynamic = 'force-dynamic';

const esc = (value: string) =>
  value.replace(/[<>&"']/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
  }[char] || char));

export async function GET() {
  const site = getSiteUrl();
  const articles = (await listPublishedArticles()).slice(0, 50);
  const items = articles.map((article) =>
    `<item><title>${esc(article.title)}</title><link>${esc(article.canonicalUrl)}</link><guid isPermaLink="true">${esc(article.canonicalUrl)}</guid><description>${esc(article.summary)}</description><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate><author>${esc(article.author)}</author></item>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(SITE_NAME)}</title><link>${site}</link><description>Science, education, technology, research and innovation from Science News 360.</description>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
