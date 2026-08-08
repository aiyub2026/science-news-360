import {NextResponse} from 'next/server';
import {saveDraftMedia} from '@/lib/server-publications';
import {sameOrigin} from '@/lib/security';

export const runtime='nodejs';

export async function POST(req:Request){
  if(!sameOrigin(req))
    return NextResponse.json({ok:false,error:'Permintaan tidak diizinkan.'},{status:403});

  try{
    const body=await req.json();
    const media=await saveDraftMedia(body);
    return NextResponse.json({ok:true,media});
  }catch(e){
    return NextResponse.json(
      {ok:false,error:e instanceof Error?e.message:'Upload media gagal.'},
      {status:400}
    );
  }
}
