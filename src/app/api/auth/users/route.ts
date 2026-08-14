import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {
 listUsers,
 listSecurityAudit,
 sessionUser,
 updateUserByAdmin,
 deleteUserByAdmin
} from '@/lib/auth/server';
import {hasCapability} from '@/lib/auth/permissions';
import {sameOrigin} from '@/lib/security';
import {readCms} from '@/lib/cms/server-store';

export const runtime='nodejs';

async function admin(){
 const jar=await cookies();
 const u=await sessionUser(jar.get('sn360_session')?.value);
 return u&&hasCapability(u.role,'MANAGE_USERS')?u:null;
}

export async function GET(){
 if(!await admin()){
  return NextResponse.json({error:'Akses ditolak.'},{status:403});
 }

 return NextResponse.json(
  {
   users:await listUsers(),
   audit:await listSecurityAudit()
  },
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

 if(!await admin()){
  return NextResponse.json({error:'Akses ditolak.'},{status:403});
 }

 try{
  const {id,...patch}=await req.json();

  return NextResponse.json({
   ok:true,
   user:await updateUserByAdmin(id,patch)
  });
 }catch(e){
  return NextResponse.json(
   {error:e instanceof Error?e.message:'Perubahan gagal.'},
   {status:400}
  );
 }
}

export async function DELETE(req:Request){
 if(!sameOrigin(req)){
  return NextResponse.json(
   {error:'Permintaan tidak diizinkan.'},
   {status:403}
  );
 }

 const actor=await admin();

 if(!actor){
  return NextResponse.json({error:'Akses ditolak.'},{status:403});
 }

 try{
  const {id}=await req.json();

  if(!id){
   return NextResponse.json(
    {error:'ID pengguna wajib diisi.'},
    {status:400}
   );
  }

  if(id===actor.id){
   return NextResponse.json(
    {error:'Administrator tidak dapat menghapus akun sendiri.'},
    {status:400}
   );
  }

  const users=await listUsers();
  const target=users.find(u=>u.id===id);

  if(!target){
   return NextResponse.json(
    {error:'Pengguna tidak ditemukan.'},
    {status:404}
   );
  }

  const roles=target.roles?.length?target.roles:[target.role];

  if(roles.includes('SYSTEM_ADMINISTRATOR')){
   return NextResponse.json(
    {error:'Akun Administrator Sistem dilindungi dan tidak dapat dihapus.'},
    {status:403}
   );
  }

  const cms=await readCms();
  const email=target.email.trim().toLowerCase();

  const ownedContent=cms.content.filter(r=>
   r.authors?.some(a=>
    (a.email||'').trim().toLowerCase()===email
   )
  );

  if(ownedContent.length>0){
   return NextResponse.json(
    {
     error:`Akun ini masih memiliki ${ownedContent.length} konten. Arsipkan atau pindahkan kepemilikan konten sebelum menghapus akun.`
    },
    {status:409}
   );
  }

  const deleted=await deleteUserByAdmin(id,actor.id);

  return NextResponse.json({
   ok:true,
   deleted
  });
 }catch(e){
  return NextResponse.json(
   {error:e instanceof Error?e.message:'Penghapusan akun gagal.'},
   {status:400}
  );
 }
}
