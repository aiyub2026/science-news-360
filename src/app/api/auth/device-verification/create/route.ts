import {NextResponse} from 'next/server';
import {createChallenge} from '@/lib/auth/device-verification';

export async function POST(){
 try{
  const challenge=await createChallenge();

  return NextResponse.json({
   ok:true,
   token:challenge.token,
   expiresAt:challenge.expiresAt
  });
 }catch{
  return NextResponse.json(
   {ok:false,error:'Tidak dapat membuat verifikasi perangkat.'},
   {status:500}
  );
 }
}
