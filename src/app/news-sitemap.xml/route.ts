import {listPublishedArticles} from '@/lib/server-publications';
import {canonicalArticleUrl} from '@/lib/social';

export const dynamic='force-dynamic';

function escapeXml(value:string){
  return value
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&apos;');
}

export async function GET(){
  const now=Date.now();
  const twoDays=2*24*60*60*1000;

  const articles=(await listPublishedArticles())
    .filter(article=>{
      const published=new Date(article.publishedAt).getTime();
      return Number.isFinite(published) &&
             published<=now &&
             now-published<=twoDays;
    })
    .sort(
      (a,b)=>
        new Date(b.publishedAt).getTime()-
        new Date(a.publishedAt).getTime()
    );

  const urls=articles.map(article=>`
  <url>
    <loc>${escapeXml(canonicalArticleUrl(article.locale,article.slug))}</loc>
    <news:news>
      <news:publication>
        <news:name>Science News 360</news:name>
        <news:language>${article.locale}</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(article.publishedAt)}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>`).join('');

  const xml=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}
</urlset>`;

  return new Response(xml,{
    headers:{
      'Content-Type':'application/xml; charset=utf-8',
      'Cache-Control':'public, max-age=300'
    }
  });
}
