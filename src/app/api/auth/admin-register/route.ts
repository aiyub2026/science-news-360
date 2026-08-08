import {NextResponse} from 'next/server';
import {registerAdministrator} from '@/lib/auth/server';
import {sameOrigin} from '@/lib/security';

export const runtime='nodejs';

export async function POST(req:Request){
  if(!sameOrigin(req))
    return NextResponse.json(
      {ok:false,error:'Permintaan tidak diizinkan.'},
      {status:403}
    );

  try{
    const user=await registerAdministrator(await req.json());
    return NextResponse.json({ok:true,user},{status:201});
  }catch(e){
    return NextResponse.json(
      {ok:false,error:e instanceof Error?e.message:'Registrasi Administrator gagal.'},
      {status:400}
    );
  }
}
