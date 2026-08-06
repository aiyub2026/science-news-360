'use client';
import type {CmsAudit,ContentRecord,MediaMeta} from './types';

export const CURRENT_KEYS={
 content:'sn360-cms-content-v201',
 audit:'sn360-cms-audit-v201',
 media:'sn360-media-assets-v201',
 profile:'sn360-author-profile',
 seo:'sn360-editorial-seo-v202',
 youtubeChannel:'sn360-youtube-channel',
 youtubeChannelId:'sn360-youtube-channel-id',
 youtubeVideos:'sn360-youtube-videos'
} as const;

const LEGACY_KEY_GROUPS={
 content:['sn360-cms-content','sn360-cms-content-v1','sn360-cms-content-v131','sn360-cms-content-v136','sn360-cms-content-v138','sn360-cms-content-v201','sn360-content','science-news-360-content'],
 audit:['sn360-cms-audit','sn360-cms-audit-v1','sn360-cms-audit-v201','sn360-audit'],
 media:['sn360-media-assets','sn360-media-assets-v1','sn360-media-assets-v131','sn360-media-assets-v201','sn360-media-library'],
 profile:['sn360-author-profile','sn360-profile','sn360-author-profile-v1'],
 seo:['sn360-editorial-seo','sn360-editorial-seo-v202','sn360-seo-workspace'],
 youtubeChannel:['sn360-youtube-channel'],
 youtubeChannelId:['sn360-youtube-channel-id'],
 youtubeVideos:['sn360-youtube-videos']
} as const;

export type BackupPayload={
 schema:'science-news-360-backup';version:'2.0.6';exportedAt:string;origin:string;
 data:{content:ContentRecord[];audit:CmsAudit[];media:MediaMeta[];profile:Record<string,unknown>;seo:unknown;youtube:{channel:string;channelId:string;videos:unknown[]}};
};

const parse=<T,>(value:string|null,fallback:T):T=>{try{return value?JSON.parse(value) as T:fallback}catch{return fallback}};
const readFirst=(keys:readonly string[])=>{for(const key of keys){const value=localStorage.getItem(key);if(value!==null)return value}return null};
const uniqueById=<T extends {id?:string}>(rows:T[])=>Array.from(new Map(rows.map((row,index)=>[row.id||`row-${index}`,row])).values());

export function migrateLegacyStorage(){
 const migrated:string[]=[];
 const mergeArray=(group:keyof typeof LEGACY_KEY_GROUPS,current:string)=>{
  const all=(LEGACY_KEY_GROUPS[group] as readonly string[]).flatMap(key=>parse<any[]>(localStorage.getItem(key),[]));
  if(all.length){localStorage.setItem(current,JSON.stringify(uniqueById(all)));migrated.push(String(group));}
 };
 mergeArray('content',CURRENT_KEYS.content);mergeArray('audit',CURRENT_KEYS.audit);mergeArray('media',CURRENT_KEYS.media);
 const copyObject=(group:keyof typeof LEGACY_KEY_GROUPS,current:string)=>{const raw=readFirst(LEGACY_KEY_GROUPS[group] as readonly string[]);if(raw!==null&&!localStorage.getItem(current)){localStorage.setItem(current,raw);migrated.push(String(group));}};
 copyObject('profile',CURRENT_KEYS.profile);copyObject('seo',CURRENT_KEYS.seo);copyObject('youtubeChannel',CURRENT_KEYS.youtubeChannel);copyObject('youtubeChannelId',CURRENT_KEYS.youtubeChannelId);copyObject('youtubeVideos',CURRENT_KEYS.youtubeVideos);
 if(migrated.length)localStorage.setItem('sn360-last-migration',JSON.stringify({at:new Date().toISOString(),migrated}));
 return migrated;
}

export function createBackup():BackupPayload{
 migrateLegacyStorage();
 return {schema:'science-news-360-backup',version:'2.0.6',exportedAt:new Date().toISOString(),origin:location.origin,data:{
  content:parse<ContentRecord[]>(localStorage.getItem(CURRENT_KEYS.content),[]),
  audit:parse<CmsAudit[]>(localStorage.getItem(CURRENT_KEYS.audit),[]),
  media:parse<MediaMeta[]>(localStorage.getItem(CURRENT_KEYS.media),[]),
  profile:parse<Record<string,unknown>>(localStorage.getItem(CURRENT_KEYS.profile),{}),
  seo:parse<unknown>(localStorage.getItem(CURRENT_KEYS.seo),{}),
  youtube:{channel:localStorage.getItem(CURRENT_KEYS.youtubeChannel)||'',channelId:localStorage.getItem(CURRENT_KEYS.youtubeChannelId)||'',videos:parse<unknown[]>(localStorage.getItem(CURRENT_KEYS.youtubeVideos),[])}
 }};
}

export function downloadBackup(){
 const payload=createBackup();const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=`ScienceNews360_Backup_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(href);return payload;
}

export function validateBackup(value:unknown):BackupPayload{
 if(!value||typeof value!=='object')throw new Error('File backup tidak valid.');
 const b=value as Partial<BackupPayload>;if(b.schema!=='science-news-360-backup'||!b.data)throw new Error('File bukan backup resmi Science News 360.');
 return b as BackupPayload;
}

export function summarizeBackup(b:BackupPayload){
 const status=b.data.content.reduce<Record<string,number>>((a,r)=>{a[r.status]=(a[r.status]||0)+1;return a},{});
 return {exportedAt:b.exportedAt,origin:b.origin,content:b.data.content.length,audit:b.data.audit.length,media:b.data.media.length,hasProfile:Object.keys(b.data.profile||{}).length>0,seoRecords:Array.isArray(b.data.seo)?b.data.seo.length:Object.keys((b.data.seo||{}) as object).length,status};
}

export function restoreBackup(b:BackupPayload,mode:'merge'|'replace'){
 validateBackup(b);
 const existingContent=parse<ContentRecord[]>(localStorage.getItem(CURRENT_KEYS.content),[]),existingAudit=parse<CmsAudit[]>(localStorage.getItem(CURRENT_KEYS.audit),[]),existingMedia=parse<MediaMeta[]>(localStorage.getItem(CURRENT_KEYS.media),[]);
 const merge=<T extends {id?:string}>(oldRows:T[],newRows:T[])=>uniqueById([...oldRows,...newRows]);
 localStorage.setItem(CURRENT_KEYS.content,JSON.stringify(mode==='merge'?merge(existingContent,b.data.content):b.data.content));
 localStorage.setItem(CURRENT_KEYS.audit,JSON.stringify(mode==='merge'?merge(existingAudit,b.data.audit):b.data.audit));
 localStorage.setItem(CURRENT_KEYS.media,JSON.stringify(mode==='merge'?merge(existingMedia,b.data.media):b.data.media));
 if(mode==='replace'||Object.keys(b.data.profile||{}).length)localStorage.setItem(CURRENT_KEYS.profile,JSON.stringify(b.data.profile||{}));
 if(mode==='replace'||b.data.seo)localStorage.setItem(CURRENT_KEYS.seo,JSON.stringify(b.data.seo||{}));
 if(b.data.youtube){localStorage.setItem(CURRENT_KEYS.youtubeChannel,b.data.youtube.channel||'');localStorage.setItem(CURRENT_KEYS.youtubeChannelId,b.data.youtube.channelId||'');localStorage.setItem(CURRENT_KEYS.youtubeVideos,JSON.stringify(b.data.youtube.videos||[]));}
 localStorage.setItem('sn360-last-restore',JSON.stringify({at:new Date().toISOString(),source:b.origin,mode}));
 window.dispatchEvent(new Event('sn360-content-restored'));
 return summarizeBackup(createBackup());
}
