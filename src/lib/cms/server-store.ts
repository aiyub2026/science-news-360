import {promises as fs} from 'node:fs';import path from 'node:path';import type {ContentRecord,CmsAudit,MediaMeta} from './types';
type Db={content:ContentRecord[];audit:CmsAudit[];media:MediaMeta[]};const FILE=path.join(process.cwd(),'.sn360-data','cms.json'),STORE='sn360-production-cms';const empty=():Db=>({content:[],audit:[],media:[]});const netlify=()=>Boolean(process.env.NETLIFY||process.env.CONTEXT||process.env.NETLIFY_SITE_ID||process.env.SITE_ID||process.env.SITE_NAME||process.env.URL);async function store(){const {getStore}=await import('@netlify/blobs');return getStore({name:STORE,consistency:'strong'})}export async function readCms():Promise<Db>{try{if(netlify()){const s=await store();return (await s.get('cms-state',{type:'json',consistency:'strong'}) as Db|null)||empty()}return JSON.parse(await fs.readFile(FILE,'utf8')) as Db}catch{return empty()}}export async function writeCms(db:Db){db.audit=db.audit.slice(0,1500);if(netlify()){const s=await store();await s.setJSON('cms-state',db);return}await fs.mkdir(path.dirname(FILE),{recursive:true});await fs.writeFile(FILE,JSON.stringify(db),'utf8')}export async function mergeCms(payload:Partial<Db>){
 const db=await readCms();

 for(const r of payload.content||[]){
  const i=db.content.findIndex(x=>x.id===r.id);

  if(i>=0){
   if(
    new Date(r.updatedAt).getTime() >=
    new Date(db.content[i].updatedAt).getTime()
   ){
    const existing=db.content[i];

    const versions=new Map(
     (existing.versions||[]).map(v=>[v.id,v])
    );

    for(const incoming of r.versions||[]){
     const old=versions.get(incoming.id);

     if(
      old &&
      !incoming.snapshot?.bodyHtml &&
      old.snapshot?.bodyHtml
     ){
      versions.set(incoming.id,old);
     }else{
      versions.set(incoming.id,incoming);
     }
    }

    db.content[i]={
     ...r,
     versions:[...versions.values()]
      .sort(
       (a,b)=>
        new Date(b.createdAt).getTime()-
        new Date(a.createdAt).getTime()
      )
      .slice(0,30)
    };
   }
  }else{
   db.content.push(r);
  }
 }

 for(const a of payload.audit||[]){
  if(!db.audit.some(x=>x.id===a.id)){
   db.audit.push(a);
  }
 }

 for(const m of payload.media||[]){
  const i=db.media.findIndex(x=>x.id===m.id);

  if(i>=0)db.media[i]=m;
  else db.media.push(m);
 }

 await writeCms(db);

 return db;
}
