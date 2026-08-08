import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import ServerPublishedArticle from '@/components/article/ServerPublishedArticle';
import {getPublishedArticle,listPublishedArticles} from '@/lib/server-publications';
import {absoluteUrl,canonicalArticleUrl,cleanSocialText,getSiteUrl,SITE_NAME,socialImageUrl,normalizePublicUrl} from '@/lib/social';

export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}):Promise<Metadata>{
 const {locale,slug}=await params;const lang=locale==='en'?'en':'id';const article=await getPublishedArticle(lang,slug);
 const title=cleanSocialText(article?.openGraphTitle||article?.seoTitle||(lang==='id'?'Artikel tidak ditemukan':'Article not found'),110);
 const description=cleanSocialText(article?.openGraphDescription||article?.seoDescription||(lang==='id'?'Science News 360 — sains, pendidikan, teknologi, riset, dan inovasi.':'Science News 360 — science, education, technology, research, and innovation.'),200);
 const canonical=canonicalArticleUrl(lang,slug);const image=article?(normalizePublicUrl(article.thumbnailUrl)||normalizePublicUrl(article.socialImageUrl)||absoluteUrl(`/${lang}/article/${encodeURIComponent(slug)}/opengraph-image`)):absoluteUrl('/images/social-default-1200x630.webp');const publishedAt=article?.publishedAt;const modifiedAt=article?.updatedAt||publishedAt;const tags=article?.tags||[];
 return {metadataBase:new URL(getSiteUrl()),title:article?`${title} | Science News 360`:'Science News 360',description,alternates:{canonical,languages:{id:canonicalArticleUrl('id',slug),en:canonicalArticleUrl('en',slug)}},robots:article?{index:true,follow:true,'max-image-preview':'large'}:{index:false,follow:false},openGraph:article?{type:'article',siteName:SITE_NAME,title,description,url:canonical,locale:lang==='id'?'id_ID':'en_US',images:[{url:image,secureUrl:image,width:1200,height:630,type:'image/webp',alt:article.socialImageAlt||title}],publishedTime:publishedAt,modifiedTime:modifiedAt,authors:[article.author],section:article.category,tags}:undefined,twitter:article?{card:'summary_large_image',site:'@ScienceNews360',creator:'@ScienceNews360',title,description,images:[{url:image,width:1200,height:630,alt:article.socialImageAlt||title}]}:undefined};
}

export default async function ArticlePage({params}:{params:Promise<{locale:string;slug:string}>}){
 const {locale,slug}=await params;const lang=locale==='en'?'en':'id';const article=await getPublishedArticle(lang,slug);if(!article)notFound();const all=(await listPublishedArticles()).filter(x=>x.locale===lang&&x.id!==article.id);const score=(x:typeof article)=>Number(x.category===article.category)*4+(x.tags||[]).filter(t=>(article.tags||[]).includes(t)).length*2;const related=all.sort((a,b)=>score(b)-score(a)).slice(0,2);const jsonLd={'@context':'https://schema.org','@type':article.type==='SCIENCE_NEWS'?'NewsArticle':'Article',headline:article.title,description:article.summary,image:[normalizePublicUrl(article.thumbnailUrl||article.socialImageUrl)],datePublished:article.publishedAt,dateModified:article.updatedAt,mainEntityOfPage:canonicalArticleUrl(lang,article.slug),author:{'@type':'Person',name:article.author,affiliation:article.authorInstitution},publisher:{'@type':'Organization',name:'Science News 360',logo:{'@type':'ImageObject',url:absoluteUrl('/images/social-default-1200x630.webp')}}};return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/><ServerPublishedArticle article={article} related={related}/></>;
}
