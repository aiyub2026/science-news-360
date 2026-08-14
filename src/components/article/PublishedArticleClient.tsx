'use client';
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {ContentRecord} from '@/lib/cms/types';
import {listContent,resolveThumbnail,subscribeContent} from '@/lib/cms/store';
import {chooseRelated} from '@/lib/cms/related';
import AuthorByline from './AuthorByline';
import ArticleActions from './ArticleActions';
import ReadingProgress from './ReadingProgress';
import {canonicalArticleUrl,SITE_NAME,socialImageUrl} from '@/lib/social';

function splitBody(html:string){
 if(typeof window==='undefined')return [html,'',''];
 const doc=new DOMParser().parseFromString(`<div id="sn360-body">${html}</div>`,'text/html');
 const root=doc.getElementById('sn360-body');
 const blocks=Array.from(root?.children||[]).map(x=>x.outerHTML);
 if(blocks.length<3){
  const paragraphs=html.split(/(?=<(?:p|h2|h3|blockquote|ul|ol|table)\b)/i).filter(Boolean);
  const a=Math.max(1,Math.round(paragraphs.length*.45));
  const b=Math.max(a+1,Math.round(paragraphs.length*.84));
  return [paragraphs.slice(0,a).join(''),paragraphs.slice(a,b).join(''),paragraphs.slice(b).join('')];
 }
 const a=Math.max(1,Math.round(blocks.length*.45));
 const b=Math.max(a+1,Math.round(blocks.length*.84));
 return [blocks.slice(0,a).join(''),blocks.slice(a,b).join(''),blocks.slice(b).join('')];
}

function RelatedBlock({item,locale,compact=false}:{item?:ContentRecord;locale:'id'|'en';compact?:boolean}){
 if(!item)return null;
 const image=resolveThumbnail(item);
 return <aside className={`dynamic-related-block ${compact?'dynamic-related-end':''}`} aria-label={locale==='id'?'Artikel terkait':'Related article'}>
  <div className="dynamic-related-label">{locale==='id'?(compact?'BACA JUGA':'BACA ARTIKEL TERKAIT'):(compact?'READ ALSO':'READ RELATED ARTICLE')}</div>
  <Link href={`/${locale}/article/${item.slug}`}>
   {image&&<img src={image} alt={item.thumbnail?.alt||item.title}/>}<div><span>{item.type.replaceAll('_',' ')}</span><strong>{item.title}</strong>{!compact&&<p>{item.summary}</p>}<em>{locale==='id'?'Baca selengkapnya →':'Read more →'}</em></div>
  </Link>
 </aside>
}

export default function PublishedArticleClient({locale,slug}:{locale:'id'|'en';slug:string}){
 const [record,setRecord]=useState<ContentRecord|null|undefined>(undefined);
 const [all,setAll]=useState<ContentRecord[]>([]);
 useEffect(()=>{const load=()=>{const rows=listContent();setAll(rows);setRecord(rows.find(r=>r.slug===slug&&r.locale===locale&&r.status==='PUBLISHED')||null)};load();return subscribeContent(load)},[locale,slug]);
 useEffect(()=>{if(!record)return;const title=record.openGraphTitle||record.seoTitle||record.title;const description=record.openGraphDescription||record.seoDescription||record.summary;const canonical=canonicalArticleUrl(locale,record.slug);const image=socialImageUrl(locale,record.slug,record.socialImageUrl);document.title=`${title} | Science News 360`;const set=(key:string,value:string,property=false)=>{let el=document.head.querySelector(`meta[${property?'property':'name'}="${key}"]`) as HTMLMetaElement|null;if(!el){el=document.createElement('meta');el.setAttribute(property?'property':'name',key);document.head.appendChild(el)}el.content=value};set('og:type','article',true);set('og:site_name',SITE_NAME,true);set('og:title',title,true);set('og:description',description,true);set('og:url',canonical,true);set('og:image',image,true);set('og:image:secure_url',image,true);set('og:image:width','1200',true);set('og:image:height','630',true);set('og:image:alt',record.socialImageAlt||record.thumbnail?.alt||record.title,true);set('twitter:card','summary_large_image');set('twitter:title',title);set('twitter:description',description);set('twitter:image',image);set('twitter:image:alt',record.socialImageAlt||record.thumbnail?.alt||record.title);let link=document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement|null;if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}link.href=canonical},[record,locale]);
 const related=useMemo(()=>record?chooseRelated(record,all):[],[record,all]);
 const chunks=useMemo(()=>record?splitBody(record.bodyHtml):['','',''],[record]);
 if(record===undefined)return <main className="published-client-state"><p>{locale==='id'?'Memuat artikel…':'Loading article…'}</p></main>;
 if(!record)return <main className="published-client-state"><h1>404</h1><h2>{locale==='id'?'Artikel tidak ditemukan':'Article not found'}</h2><Link href={`/${locale}`}>{locale==='id'?'Kembali ke Beranda':'Return Home'}</Link></main>;
 const words=record.bodyHtml.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;
 const minutes=Math.max(1,Math.ceil(words/200));
 return <main className="production-article dynamic-published-article"><ReadingProgress/><div className="shell article-breadcrumb"><Link href={`/${locale}`}>{locale==='id'?'Beranda':'Home'}</Link><span>›</span><span>{record.type.replaceAll('_',' ')}</span></div><header className="shell article-premium-header"><div className="article-kickers"><span className="eyebrow">{record.type.replaceAll('_',' ')}</span><span className="verified-label">✓ {locale==='id'?'Diterbitkan editorial':'Editorially published'}</span></div><h1>{record.title}</h1>{record.subtitle&&<h2 className="published-subtitle">{record.subtitle}</h2>}<p>{record.summary}</p><AuthorByline fallbackName={record.authors[0]?.name||'Science News 360'} fallbackInstitution={record.authors[0]?.affiliation||'Science News 360'} fallbackPhoto={record.authors[0]?.photo} locale={locale} publishedAt={record.publishedAt?new Date(record.publishedAt).toLocaleDateString(locale==='id'?'id-ID':'en-US'):'—'} updatedAt={new Date(record.updatedAt).toLocaleDateString(locale==='id'?'id-ID':'en-US')} time={`${minutes} ${locale==='id'?'menit baca':'min read'}`} doi={record.doi||'—'}/><ArticleActions title={record.title} locale={locale} canonicalUrl={canonicalArticleUrl(locale,record.slug)}/></header>{record.thumbnail?.preview&&<figure className="shell article-premium-hero"><img src={record.thumbnail.preview} alt={record.thumbnail.alt||record.title}/><figcaption><span>{record.thumbnail.credit||'Science News 360'}</span><span>{record.thumbnail.caption||''}</span></figcaption></figure>}<div className="shell dynamic-article-layout"><article className="article-reading-column"><div className="dynamic-body" dangerouslySetInnerHTML={{__html:chunks[0]}}/><RelatedBlock item={related[0]} locale={locale}/><div className="dynamic-body" dangerouslySetInnerHTML={{__html:chunks[1]}}/><RelatedBlock item={related[1]} locale={locale} compact/><div className="dynamic-body" dangerouslySetInnerHTML={{__html:chunks[2]}}/>{record.inlineMedia.map((m,i)=><figure className="dynamic-inline-media" key={m.id||i}>{m.preview&&<img src={m.preview} alt={m.alt||`${record.title} ${i+1}`}/>}<figcaption>{m.caption||m.name}{m.credit?` — ${m.credit}`:''}</figcaption></figure>)}{record.references&&<section className="article-content-section references-section"><h2>{locale==='id'?'Referensi':'References'}</h2><div className="preline-text">{record.references}</div></section>}</article></div></main>
}
