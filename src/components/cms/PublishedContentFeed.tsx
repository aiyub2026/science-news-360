'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {ContentRecord} from '@/lib/cms/types';
import {listContent,subscribeContent} from '@/lib/cms/store';

export default function PublishedContentFeed({locale}:{locale:'id'|'en'}){
 const [rows,setRows]=useState<ContentRecord[]>([]);
 useEffect(()=>{const load=()=>setRows(listContent().filter(r=>r.status==='PUBLISHED'&&r.locale===locale).sort((a,b)=>new Date(b.publishedAt||b.updatedAt).getTime()-new Date(a.publishedAt||a.updatedAt).getTime()));load();return subscribeContent(load)},[locale]);
 if(!rows.length)return null;
 return <section className="shell section published-editorial-feed"><div className="section-head"><div><span>00 / PUBLISHED</span><h2>{locale==='id'?'Baru Diterbitkan':'Newly Published'}</h2></div></div><div className="news-grid">{rows.slice(0,6).map(r=><article className="story-card" key={r.id}><Link href={`/${locale}/article/${r.slug}`} className="story-image">{r.thumbnail?.preview?<img src={r.thumbnail.preview} alt={r.thumbnail.alt||r.title}/>:<div className="published-fallback-visual">SCIENCE NEWS 360</div>}<span>{r.type.replaceAll('_',' ')}</span></Link><div className="story-copy"><Link href={`/${locale}/article/${r.slug}`}><h3>{r.title}</h3></Link><p>{r.summary}</p><small>{r.authors[0]?.name||'Science News 360'} · {Math.max(1,Math.ceil(r.bodyHtml.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length/200))} {locale==='id'?'menit':'min'}</small></div></article>)}</div></section>
}
