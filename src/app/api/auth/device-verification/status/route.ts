import {NextRequest,NextResponse} from 'next/server';
import {getChallenge} from '@/lib/auth/device-verification';

export async function GET(req:NextRequest){
 const token=req.nextUrl.searchParams.get('token')||'';

 if(!token){
  return NextResponse.json(
   {ok:false,error:'Token diperlukan.'},
   {status:400}
  );
 }

 const challenge=await getChallenge(token);

 if(!challenge){
  return NextResponse.json(
   {ok:false,status:'NOT_FOUND'},
   {status:404}
  );
 }

 return NextResponse.json({
  ok:true,
  status:challenge.status,
  expiresAt:challenge.expiresAt
 });
}
