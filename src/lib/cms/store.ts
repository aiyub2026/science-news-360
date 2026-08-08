'use client';
import {CmsAudit,ContentRecord,ContentStatus,MediaMeta} from './types';
import {scheduleMirror} from './persistence';
const CONTENT='sn360-cms-content-v201',AUDIT='sn360-cms-audit-v201',MEDIA='sn360-media-assets-v201';
const read=<T,>(k:string,f:T):T=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v) as T:f}catch{return f}};
const emit=()=>{window.dispatchEvent(new CustomEvent('sn360-content-change'));scheduleMirror()};
function stripMediaPreview<T extends {preview?:string} | undefined>(m:T):T{
  if(!m)return m;
  if(typeof m.preview==='string'&&m.preview.startsWith('data:image')){
    return {...m,preview:''} as T;
  }
  return m;
}

function compactRecord(r:ContentRecord):ContentRecord{
  return {
    ...r,
    thumbnail:stripMediaPreview(r.thumbnail),
    customVideoThumbnail:stripMediaPreview(r.customVideoThumbnail),
    inlineMedia:(r.inlineMedia||[]).map(stripMediaPreview),
    versions:(r.versions||[]).slice(0,20).map(v=>({
      ...v,
      snapshot:{
        ...v.snapshot,
        thumbnail:stripMediaPreview(v.snapshot?.thumbnail),
        inlineMedia:(v.snapshot?.inlineMedia||[]).map(stripMediaPreview)
      }
    }))
  };
}
function recoverQuota(){try{localStorage.removeItem(MEDIA)}catch{}try{const rows=read<ContentRecord[]>(CONTENT,[]).map(compactRecord);localStorage.setItem(CONTENT,JSON.stringify(rows))}catch{}try{localStorage.setItem(AUDIT,JSON.stringify(read<CmsAudit[]>(AUDIT,[]).slice(0,100)))}catch{}}
function syncServer(){try{const content=read<ContentRecord[]>(CONTENT,[]),auditRows=read<CmsAudit[]>(AUDIT,[]),media=read<MediaMeta[]>(MEDIA,[]);void fetch('/api/cms',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content,audit:auditRows,media})})}catch{}}
function safeWrite(k:string,v:unknown){const payload=JSON.stringify(v);try{localStorage.setItem(k,payload)}catch(e){if(e instanceof DOMException&&(e.name==='QuotaExceededError'||e.name==='NS_ERROR_DOM_QUOTA_REACHED')){recoverQuota();localStorage.setItem(k,payload)}else throw e}emit();window.setTimeout(syncServer,150)}
export const listContent=()=>read<ContentRecord[]>(CONTENT,[]);
export const getContent=(id:string)=>listContent().find(x=>x.id===id)||null;
export const listAudit=()=>read<CmsAudit[]>(AUDIT,[]);
export const listMedia=()=>read<MediaMeta[]>(MEDIA,[]);
export function resolveThumbnail(r:ContentRecord){return r.thumbnail?.preview||r.customVideoThumbnail?.preview||r.youtubeThumbnail||r.inlineMedia?.find(m=>m.preview)?.preview||''}
export function saveMedia(media:MediaMeta){const rows=listMedia();const row={...media,id:media.id||crypto.randomUUID(),createdAt:media.createdAt||new Date().toISOString()};const i=rows.findIndex(x=>x.id===row.id);if(i>=0)rows[i]=row;else rows.unshift(row);safeWrite(MEDIA,rows.slice(0,80));return row}
export function removeMedia(id:string){safeWrite(MEDIA,listMedia().filter(x=>x.id!==id))}
export function audit(contentId:string,action:string,detail:string,meta:Partial<CmsAudit>={}){safeWrite(AUDIT,[{id:crypto.randomUUID(),contentId,action,detail,at:new Date().toISOString(),...meta},...listAudit()].slice(0,500))}
export function saveContent(record:ContentRecord,summary='Draft saved',actor='Current user',role='AUTHOR'){
 const rows=listContent(),i=rows.findIndex(x=>x.id===record.id),now=new Date().toISOString(),previous=i>=0?rows[i]:null,version=(previous?.versions?.[0]?.version||0)+1;
 const snapshot={title:record.title,subtitle:record.subtitle,summary:record.summary,bodyHtml:record.bodyHtml,status:record.status,thumbnail:record.thumbnail,inlineMedia:record.inlineMedia,videoMethod:record.videoMethod,youtubeUrl:record.youtubeUrl,seoTitle:record.seoTitle,seoDescription:record.seoDescription,focusKeyword:record.focusKeyword,tags:record.tags,internalLinks:record.internalLinks,relatedMode:record.relatedMode,relatedMiddleId:record.relatedMiddleId,relatedEndId:record.relatedEndId,slug:record.slug,canonicalUrl:record.canonicalUrl,openGraphTitle:record.openGraphTitle,openGraphDescription:record.openGraphDescription,socialImageUrl:record.socialImageUrl,socialImageAlt:record.socialImageAlt,twitterCard:record.twitterCard,editorialNotes:record.editorialNotes,factCheckNotes:record.factCheckNotes};
 const next:ContentRecord={...record,priority:record.priority||'NORMAL',updatedAt:now,submittedAt:record.status==='SUBMITTED'?(record.submittedAt||now):record.submittedAt,reviewStartedAt:record.status==='REVIEW'?(record.reviewStartedAt||now):record.reviewStartedAt,approvedAt:record.status==='ACCEPTED'?(record.approvedAt||now):record.approvedAt,publishedAt:record.status==='PUBLISHED'?(record.publishedAt||now):record.publishedAt,versions:[{id:crypto.randomUUID(),version,createdAt:now,summary,snapshot},...(previous?.versions||record.versions||[])].slice(0,30)};
 if(i>=0)rows[i]=next;else rows.unshift(next);safeWrite(CONTENT,rows.map(compactRecord));audit(record.id,'CONTENT_SAVED',summary,{actor,role,before:previous?{status:previous.status,title:previous.title}:null,after:{status:next.status,title:next.title}});return next;
}
export function changeStatus(id:string,status:ContentStatus,detail:string,actor='Editorial user',role='EDITOR'){const r=getContent(id);if(!r)return null;const now=new Date().toISOString();const next={...r,status,publishedAt:status==='PUBLISHED'?(r.publishedAt||now):r.publishedAt,approvedAt:status==='ACCEPTED'?(r.approvedAt||now):r.approvedAt,reviewStartedAt:status==='REVIEW'?(r.reviewStartedAt||now):r.reviewStartedAt};return saveContent(next,detail,actor,role)}
export function duplicateContent(id:string){const r=getContent(id);if(!r)return null;const now=new Date().toISOString();return saveContent({...r,id:crypto.randomUUID(),title:`Salinan — ${r.title}`,slug:`${r.slug}-copy`,status:'DRAFT',createdAt:now,updatedAt:now,publishedAt:undefined,versions:[]},'Content duplicated')}
export function removeContent(id:string){safeWrite(CONTENT,listContent().filter(x=>x.id!==id));audit(id,'CONTENT_REMOVED','Content removed')}
export function exportContentRecord(id:string){const r=getContent(id);if(!r)return;const blob=new Blob([JSON.stringify(r,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`sn360-${r.slug||r.id}.json`;a.click();URL.revokeObjectURL(a.href)}
export function subscribeContent(fn:()=>void){window.addEventListener('sn360-content-change',fn);window.addEventListener('storage',fn);return()=>{window.removeEventListener('sn360-content-change',fn);window.removeEventListener('storage',fn)}}
