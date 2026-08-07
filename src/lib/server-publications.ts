import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ContentRecord, MediaMeta } from '@/lib/cms/types';
import { absoluteUrl, getSiteUrl, isPublicHttpsImage } from '@/lib/social';

export type PublicArticle = {
  id: string;
  locale: 'id'|'en';
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  bodyHtml: string;
  type: string;
  author: string;
  authorInstitution: string;
  authorPhoto?: string;
  tags: string[];
  category: string;
  publishedAt: string;
  updatedAt: string;
  doi?: string;
  references?: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  thumbnailCaption?: string;
  thumbnailCredit?: string;
  canonicalUrl: string;
  seoTitle: string;
  seoDescription: string;
  openGraphTitle: string;
  openGraphDescription: string;
  socialImageUrl: string;
  socialImageAlt: string;
  twitterCard: 'summary_large_image';
};

type LocalDb = { publications: Record<string, PublicArticle>; media: Record<string,{contentType:string,data:string}> };
const DB_FILE = path.join(process.cwd(), '.sn360-data', 'publications.json');
const STORE_NAME = 'sn360-production-public-content-v21';
const publicationKey = (locale:string,slug:string)=>`article:${locale}:${slug}`;

function useNetlify(){return Boolean(process.env.NETLIFY || process.env.CONTEXT || process.env.NETLIFY_SITE_ID)}
async function blobStore(){const {getStore}=await import('@netlify/blobs');return getStore({name:STORE_NAME,consistency:'strong'});}
async function readLocal():Promise<LocalDb>{try{return JSON.parse(await fs.readFile(DB_FILE,'utf8')) as LocalDb}catch{return {publications:{},media:{}}}}
async function writeLocal(db:LocalDb){await fs.mkdir(path.dirname(DB_FILE),{recursive:true});await fs.writeFile(DB_FILE,JSON.stringify(db,null,2),'utf8')}
function dataUrl(media?:MediaMeta){const value=media?.preview||'';const match=value.match(/^data:([^;]+);base64,(.+)$/);return match?{contentType:match[1],data:match[2]}:null}
function safeSlug(value:string){return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,100)}

async function persistMedia(article:ContentRecord, media?:MediaMeta):Promise<string|undefined>{
  if(!media?.preview)return undefined;
  if(isPublicHttpsImage(media.preview))return media.preview;
  const parsed=dataUrl(media); if(!parsed)return undefined;
  const ext=parsed.contentType.includes('png')?'png':parsed.contentType.includes('webp')?'webp':'jpg';
  const key=`media__${safeSlug(article.slug)}__${safeSlug(media.id||'thumbnail')}.${ext}`;
  if(useNetlify()){
    const store=await blobStore();
    const bytes=Uint8Array.from(Buffer.from(parsed.data,'base64'));
    await store.set(key,new Blob([bytes],{type:parsed.contentType}),{metadata:{contentType:parsed.contentType,articleId:article.id}});
  }else{
    const db=await readLocal();db.media[key]={contentType:parsed.contentType,data:parsed.data};await writeLocal(db);
  }
  return absoluteUrl(`/api/public-media/${encodeURIComponent(key)}`);
}

export async function savePublishedArticle(record:ContentRecord):Promise<PublicArticle>{
  if(record.status!=='PUBLISHED')throw new Error('Hanya artikel berstatus Published yang dapat disinkronkan.');
  const thumbnailPublic=await persistMedia(record,record.thumbnail);
  const firstPublic=await persistMedia(record,record.inlineMedia?.[0]);
  const youtube=record.youtubeId?`https://i.ytimg.com/vi/${record.youtubeId}/maxresdefault.jpg`:undefined;
  const socialCandidate=isPublicHttpsImage(record.socialImageUrl)?record.socialImageUrl:thumbnailPublic||youtube||firstPublic;
  const fallback=absoluteUrl('/images/social-default-1200x630.webp');
  const canonical=absoluteUrl(`/${record.locale}/article/${encodeURIComponent(record.slug)}`);
  const article:PublicArticle={
    id:record.id,locale:record.locale,slug:record.slug,title:record.title,subtitle:record.subtitle,summary:record.summary,bodyHtml:record.bodyHtml,type:record.type,
    author:record.authors?.[0]?.name||'Science News 360',authorInstitution:record.authors?.[0]?.affiliation||'Science News 360',authorPhoto:record.authors?.[0]?.photo,
    tags:record.tags||[],category:record.topic||record.type.replaceAll('_',' '),publishedAt:record.publishedAt||new Date().toISOString(),updatedAt:record.updatedAt||new Date().toISOString(),doi:record.doi,references:record.references,
    thumbnailUrl:thumbnailPublic||firstPublic||fallback,thumbnailAlt:record.thumbnail?.alt||record.socialImageAlt||record.title,thumbnailCaption:record.thumbnail?.caption,thumbnailCredit:record.thumbnail?.credit,
    canonicalUrl:canonical,seoTitle:record.seoTitle||record.title,seoDescription:record.seoDescription||record.summary,openGraphTitle:record.openGraphTitle||record.seoTitle||record.title,
    openGraphDescription:record.openGraphDescription||record.seoDescription||record.summary,socialImageUrl:socialCandidate||fallback,socialImageAlt:record.socialImageAlt||record.thumbnail?.alt||record.title,twitterCard:'summary_large_image'
  };
  if(useNetlify()){const store=await blobStore();await store.setJSON(publicationKey(article.locale,article.slug),article,{metadata:{status:'PUBLISHED',updatedAt:article.updatedAt}})}
  else {const db=await readLocal();db.publications[publicationKey(article.locale,article.slug)]=article;await writeLocal(db)}
  return article;
}

export async function getPublishedArticle(locale:'id'|'en',slug:string):Promise<PublicArticle|null>{
  try{
    if(useNetlify()){const store=await blobStore();return await store.get(publicationKey(locale,slug),{type:'json',consistency:'strong'}) as PublicArticle|null}
    const db=await readLocal();return db.publications[publicationKey(locale,slug)]||null;
  }catch{return null}
}

export async function listPublishedArticles():Promise<PublicArticle[]>{
  try{
    if(useNetlify()){
      const store=await blobStore();const result=await store.list({prefix:'article:'});const out:PublicArticle[]=[];
      for(const blob of result.blobs){const row=await store.get(blob.key,{type:'json'}) as PublicArticle|null;if(row)out.push(row)}return out;
    }
    return Object.values((await readLocal()).publications);
  }catch{return []}
}

export async function readPublicMedia(key:string):Promise<{body:ArrayBuffer;contentType:string}|null>{
  try{
    if(useNetlify()){
      const store=await blobStore();const row=await store.getWithMetadata(key,{type:'arrayBuffer'});if(!row||!row.data)return null;
      return {body:row.data as ArrayBuffer,contentType:String(row.metadata?.contentType||'image/webp')};
    }
    const db=await readLocal();const row=db.media[key];if(!row)return null;const bytes=Buffer.from(row.data,'base64');return {body:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),contentType:row.contentType};
  }catch{return null}
}

export function publicArticleDiagnostics(article:PublicArticle){
  const warnings:string[]=[];const site=getSiteUrl();
  if(!site.startsWith('https://'))warnings.push('Alamat situs belum menggunakan HTTPS.');
  if(!article.canonicalUrl.startsWith(site))warnings.push('Canonical URL tidak memakai domain resmi.');
  if(!isPublicHttpsImage(article.socialImageUrl))warnings.push('Gambar sosial belum memakai URL HTTPS publik.');
  if(/localhost|127\.0\.0\.1|blob:|data:image|\/Users\//i.test(JSON.stringify(article)))warnings.push('Ditemukan alamat lokal, Blob URL, Base64, atau path komputer.');
  return warnings;
}
