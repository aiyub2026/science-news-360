'use client';
import {useEffect,useMemo,useState} from 'react';
import {ContentRecord} from '@/lib/cms/types';
import {editorialSeoScore} from '@/lib/cms/validation';
import {listContent,saveContent} from '@/lib/cms/store';

const slugify=(x:string)=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').split('-').filter(Boolean).slice(0,10).join('-').slice(0,72).replace(/-$/,'');
const checkOptions={
 eeat:['Penulis dan afiliasi terverifikasi','Sumber primer tersedia','Konflik kepentingan jelas','Tanggal pembaruan akurat'],
 discover:['Thumbnail minimal 1200 px','Judul tidak clickbait','Artikel bernilai aktual atau evergreen','Byline dan tanggal publikasi lengkap']
};

export default function EditorialSeoWorkspace({role}:{role:'reviewer'|'editor'|'admin'}){
 const [rows,setRows]=useState<ContentRecord[]>([]);const [selected,setSelected]=useState('');const [notice,setNotice]=useState('');
 useEffect(()=>{const data=listContent().filter(x=>['SUBMITTED','REVIEW','REVISION','ACCEPTED','SCHEDULED','PUBLISHED'].includes(x.status));setRows(data);setSelected(data[0]?.id||'')},[]);
 const record=rows.find(x=>x.id===selected)||null;
 const score=useMemo(()=>record?editorialSeoScore(record):null,[record]);
 const update=(patch:Partial<ContentRecord>)=>setRows(v=>v.map(x=>x.id===selected?{...x,...patch}:x));
 const toggle=(key:'eeatChecklist'|'discoverChecklist',value:string)=>{if(!record)return;const current=record[key]||[];update({[key]:current.includes(value)?current.filter(x=>x!==value):[...current,value]})};
 const generateSlug=()=>{if(!record)return;const generated=slugify(record.seoTitle||record.title);update({slug:generated,canonicalUrl:`/id/article/${generated}`});setNotice('Slug dan canonical URL berhasil dibuat otomatis.');};
 const save=()=>{if(!record)return;const next={...record,slug:record.slug||slugify(record.title),canonicalUrl:record.canonicalUrl||`/id/article/${record.slug||slugify(record.title)}`,openGraphTitle:record.openGraphTitle||record.seoTitle||record.title,openGraphDescription:record.openGraphDescription||record.seoDescription||record.summary,editorialSeoStatus:((score?.score||0)>=80?'READY':'IN_PROGRESS') as ContentRecord['editorialSeoStatus']};saveContent(next,`Editorial SEO updated by ${role}`);setRows(v=>v.map(x=>x.id===next.id?next:x));setNotice('Pengaturan SEO editorial berhasil disimpan.')};
 return <section className="editorial-seo-workspace"><header><div><span className="eyebrow">EDITORIAL SEO CONTROL</span><h1>SEO & Discover Workspace</h1><p>Pengaturan ini hanya tersedia untuk Reviewer, Editor, dan Admin. Penulis tidak dibebani pengaturan SEO.</p></div><span className="permission-badge">{role.toUpperCase()}</span></header>
  {!rows.length?<div className="empty-editorial-seo"><h2>Belum ada artikel dalam antrean editorial</h2><p>Artikel akan muncul setelah penulis mengirimkannya untuk review.</p></div>:<>
  <label className="seo-content-selector"><span>Pilih artikel</span><select value={selected} onChange={e=>setSelected(e.target.value)}>{rows.map(x=><option key={x.id} value={x.id}>{x.title} — {x.status}</option>)}</select></label>
  {record&&<div className="editorial-seo-grid"><div className="editorial-seo-form">
   {notice&&<div className="cms-notice success"><span>✓</span><b>{notice}</b><button onClick={()=>setNotice('')}>×</button></div>}
   <div className="editorial-context"><b>{record.title}</b><span>{record.authors[0]?.name} · {record.authors[0]?.affiliation}</span><small>Status: {record.status}</small></div>
   <label><span>SEO Title</span><input value={record.seoTitle||''} onChange={e=>update({seoTitle:e.target.value})} placeholder={record.title}/><small>{(record.seoTitle||'').length}/70 karakter</small></label>
   <label><span>Focus Keyword</span><input value={record.focusKeyword||''} onChange={e=>update({focusKeyword:e.target.value})}/></label>
   <label><span>Meta Description</span><textarea rows={4} value={record.seoDescription||''} onChange={e=>update({seoDescription:e.target.value})}/><small>{(record.seoDescription||'').length}/165 karakter</small></label>
   <label><span>Slug</span><div className="input-action"><input value={record.slug||''} onChange={e=>{const slug=slugify(e.target.value);update({slug,canonicalUrl:record.canonicalUrl?.includes('/article/')?`/id/article/${slug}`:record.canonicalUrl})}}/><button type="button" onClick={generateSlug}>Buat Otomatis</button></div><small>Slug otomatis memakai SEO Title, maksimal 10 kata dan 72 karakter.</small></label>
   <label><span>Canonical URL</span><input value={record.canonicalUrl||''} onChange={e=>update({canonicalUrl:e.target.value})} placeholder={`/id/article/${record.slug||slugify(record.title)}`}/></label>
   <div className="form-grid"><label><span>Schema</span><select value={record.schemaType||'NewsArticle'} onChange={e=>update({schemaType:e.target.value as ContentRecord['schemaType']})}><option>NewsArticle</option><option>ScholarlyArticle</option><option>Article</option><option>VideoObject</option></select></label><label><span>Twitter Card</span><select value={record.twitterCard||'summary_large_image'} onChange={e=>update({twitterCard:e.target.value as ContentRecord['twitterCard']})}><option value="summary_large_image">Large Image</option><option value="summary">Summary</option></select></label></div>
   <label><span>OpenGraph Title</span><input value={record.openGraphTitle||''} onChange={e=>update({openGraphTitle:e.target.value})} placeholder={record.seoTitle||record.title}/></label>
   <label><span>OpenGraph Description</span><textarea rows={3} value={record.openGraphDescription||''} onChange={e=>update({openGraphDescription:e.target.value})} placeholder={record.seoDescription||record.summary}/></label>
   <label><span>Internal Link Recommendation</span><textarea rows={4} value={(record.internalLinks||[]).join('\n')} onChange={e=>update({internalLinks:e.target.value.split('\n').map(x=>x.trim()).filter(Boolean)})} placeholder="Satu URL internal per baris"/></label>
   <div className="editorial-checks"><h3>EEAT Checklist</h3>{checkOptions.eeat.map(x=><label key={x}><input type="checkbox" checked={(record.eeatChecklist||[]).includes(x)} onChange={()=>toggle('eeatChecklist',x)}/><span>{x}</span></label>)}<h3>Google Discover Checklist</h3>{checkOptions.discover.map(x=><label key={x}><input type="checkbox" checked={(record.discoverChecklist||[]).includes(x)} onChange={()=>toggle('discoverChecklist',x)}/><span>{x}</span></label>)}</div>
   <button className="btn btn-primary" onClick={save}>Simpan SEO Editorial</button>
  </div><aside className="editorial-seo-preview"><div className={`seo-score ${(score?.score||0)>=80?'good':(score?.score||0)>=60?'fair':'poor'}`}><strong>{score?.score||0}</strong><span>EDITORIAL SEO SCORE</span></div>{score?.checks.map(c=><div className={c.ok?'ok':'warn'} key={c.label}><b>{c.ok?'✓':'!'}</b><span>{c.label}<small>{!c.ok&&c.tip}</small></span></div>)}<div className="google-preview"><small>Google Search Preview</small><b>{record.seoTitle||record.title}</b><em>sciencenews360.com/id/article/{record.slug||slugify(record.title)}</em><p>{record.seoDescription||record.summary}</p></div><div className="og-preview">{record.thumbnail?.preview&&<img src={record.thumbnail.preview} alt="OpenGraph preview"/>}<small>OpenGraph Preview</small><b>{record.openGraphTitle||record.seoTitle||record.title}</b><p>{record.openGraphDescription||record.seoDescription||record.summary}</p></div></aside></div>}
  </>}
 </section>
}
