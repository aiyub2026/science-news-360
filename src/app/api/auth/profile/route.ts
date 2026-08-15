import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {sessionUser,updateOwnProfile} from '@/lib/auth/server';
import {sameOrigin} from '@/lib/security';

export const runtime='nodejs';
export const dynamic='force-dynamic';

async function current(){
 const jar=await cookies();
 return sessionUser(jar.get('sn360_session')?.value);
}

export async function GET(){
 const user=await current();

 if(!user){
  return NextResponse.json(
   {error:'Akses ditolak.'},
   {status:401}
  );
 }

 return NextResponse.json(
  {user},
  {headers:{'Cache-Control':'no-store'}}
 );
}

export async function PATCH(req:Request){
 if(!sameOrigin(req)){
  return NextResponse.json(
   {error:'Permintaan tidak diizinkan.'},
   {status:403}
  );
 }

 const user=await current();

 if(!user){
  return NextResponse.json(
   {error:'Akses ditolak.'},
   {status:401}
  );
 }

 try{
  const body=await req.json();

  const updated=await updateOwnProfile(
   user.id,
   {
    name:body?.name,
    institution:body?.institution,
    profile:body?.profile
   }
  );

  return NextResponse.json({ok:true,user:updated});
 }catch(error){
  return NextResponse.json(
   {
    error:error instanceof Error
     ?error.message
     :'Profil gagal disimpan.'
   },
   {status:400}
  );
 }
}
