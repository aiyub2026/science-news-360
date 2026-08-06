import {readPublicMedia} from '@/lib/server-publications';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{key:string}>}){const {key}=await params;const media=await readPublicMedia(decodeURIComponent(key));if(!media)return new Response('Media tidak ditemukan',{status:404});return new Response(media.body,{headers:{'Content-Type':media.contentType,'Cache-Control':'public, max-age=31536000, immutable','Access-Control-Allow-Origin':'*'}})}
