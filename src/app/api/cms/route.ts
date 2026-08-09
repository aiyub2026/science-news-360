import {NextResponse} from 'next/server';import {cookies} from 'next/headers';import {sessionUser} from '@/lib/auth/server';import {hasCapability} from '@/lib/auth/permissions';import {mergeCms,readCms} from '@/lib/cms/server-store';import {sameOrigin} from '@/lib/security';
const ADMIN_ONLY_CONTENT_TYPES=new Set([
 'COURSE_MATERIAL',
 'LEARNING_MODULE',
 'ACADEMIC_TUTORIAL',
 'LEARNING_VIDEO'
]);

function isAdministrator(user:any){
 const roles=user?.roles?.length?user.roles:[user?.role];
 return roles.some((role:string)=>
  role==='ADMINISTRATOR'||role==='SYSTEM_ADMINISTRATOR'
 );
}

export const runtime='nodejs';export const dynamic='force-dynamic';async function current(){const jar=await cookies();return sessionUser(jar.get('sn360_session')?.value)}export async function GET(){const u=await current();if(!u)return NextResponse.json({error:'Akses ditolak.'},{status:401});const db=await readCms();const full=hasCapability(u.role,'REVIEW_CONTENT')||hasCapability(u.role,'MANAGE_USERS')||hasCapability(u.role,'PUBLISH_CONTENT');return NextResponse.json({...db,content:full?db.content:db.content.filter(r=>r.authors?.some(a=>a.email?.toLowerCase()===u.email.toLowerCase()))},{headers:{'Cache-Control':'no-store'}})}export async function POST(req:Request){if(!sameOrigin(req))return NextResponse.json({error:'Permintaan tidak diizinkan.'},{status:403});const u=await current();if(!u)return NextResponse.json({error:'Akses ditolak.'},{status:401});const body=await req.json();const records=(body.content||[]) as any[];

if(!isAdministrator(u)){
 for(const r of records){
  if(ADMIN_ONLY_CONTENT_TYPES.has(r?.type)){
   return NextResponse.json(
    {error:'Jenis konten ini hanya dapat dikelola Administrator.'},
    {status:403}
   );
  }
 }
}if(!hasCapability(u.role,'REVIEW_CONTENT')&&!hasCapability(u.role,'MANAGE_USERS'))for(const r of records){if(!r.authors?.some((a:any)=>a.email?.toLowerCase()===u.email.toLowerCase()))return NextResponse.json({error:'Tidak boleh menyimpan konten milik pengguna lain.'},{status:403})}const db=await mergeCms(body);return NextResponse.json({ok:true,count:db.content.length})}
