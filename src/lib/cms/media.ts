import {MediaMeta} from './types';
export const IMAGE_TYPES=['image/jpeg','image/png','image/webp'];
export const MAX_SOURCE_IMAGE=10*1024*1024;
export const MAX_INLINE=3;

export function fileToDataUrl(file:File):Promise<string>{return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('File tidak dapat dibaca.'));reader.readAsDataURL(file)})}
export function imageDimensions(dataUrl:string):Promise<{width:number;height:number}>{return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(new Error('Gambar tidak valid.'));image.src=dataUrl})}
function loadImage(src:string):Promise<HTMLImageElement>{return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src})}
function estimatedBytes(dataUrl:string){const comma=dataUrl.indexOf(',');const payload=comma>=0?dataUrl.slice(comma+1):dataUrl;return Math.ceil(payload.length*0.75)}

/** Compresses images aggressively enough to keep browser storage stable. */
export async function prepareImage(file:File,kind:'thumbnail'|'inline'|'profile'='inline'):Promise<MediaMeta>{
 if(!IMAGE_TYPES.includes(file.type))throw new Error('Format harus JPG, PNG, atau WebP.');
 if(file.size>MAX_SOURCE_IMAGE)throw new Error('Ukuran file awal maksimum 10 MB.');
 const source=await fileToDataUrl(file);const dim=await imageDimensions(source);
 const minW=kind==='thumbnail'?1200:kind==='profile'?400:600;const minH=kind==='thumbnail'?630:kind==='profile'?400:400;
 if(dim.width<minW||dim.height<minH)throw new Error(`Resolusi minimum ${minW}×${minH} piksel.`);
 let maxW=kind==='thumbnail'?1600:kind==='profile'?800:1200;let maxH=kind==='thumbnail'?900:kind==='profile'?800:900;
 const target=kind==='thumbnail'?420*1024:kind==='profile'?180*1024:300*1024;
 let scale=Math.min(1,maxW/dim.width,maxH/dim.height);let quality=.78;let preview='';let width=0;let height=0;
 const image=await loadImage(source);
 for(let attempt=0;attempt<8;attempt++){
  width=Math.max(1,Math.round(dim.width*scale));height=Math.max(1,Math.round(dim.height*scale));
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Browser tidak mendukung optimasi gambar.');
  ctx.drawImage(image,0,0,width,height);preview=canvas.toDataURL('image/webp',quality);
  if(estimatedBytes(preview)<=target)break;
  if(quality>.48)quality-=.1;else scale*=.82;
 }
 const size=estimatedBytes(preview);
 if(size>target*1.25)throw new Error(`Gambar masih terlalu besar setelah optimasi (${Math.round(size/1024)} KB). Gunakan gambar yang lebih sederhana atau lebih kecil.`);
 return {id:crypto.randomUUID(),name:file.name.replace(/\.[^.]+$/,'.webp'),type:'image/webp',size,preview,width,height,createdAt:new Date().toISOString()};
}
