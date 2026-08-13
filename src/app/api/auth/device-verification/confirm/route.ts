import {NextRequest,NextResponse} from 'next/server';
import {confirmChallenge} from '@/lib/auth/device-verification';

export async function POST(req:NextRequest){
 try{
  const body=await req.json();
  const token=String(body?.token||'');

  if(!token){
   return NextResponse.json(
    {ok:false,error:'Token diperlukan.'},
    {status:400}
   );
  }

  const challenge=await confirmChallenge(token);

  if(!challenge){
   return NextResponse.json(
    {ok:false,error:'Verifikasi tidak ditemukan.'},
    {status:404}
   );
  }

  if(challenge.status==='EXPIRED'){
   return NextResponse.json(
    {ok:false,status:'EXPIRED',error:'QR Code sudah kedaluwarsa.'},
    {status:410}
   );
  }

  return NextResponse.json({
   ok:true,
   status:challenge.status
  });
 }catch{
  return NextResponse.json(
   {ok:false,error:'Konfirmasi perangkat gagal.'},
   {status:500}
  );
 }
}
