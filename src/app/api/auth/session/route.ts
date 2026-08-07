import {NextResponse} from 'next/server';import {cookies} from 'next/headers';import {sessionUser} from '@/lib/auth/server';
export const runtime='nodejs';export async function GET(){const jar=await cookies();return NextResponse.json({user:await sessionUser(jar.get('sn360_session')?.value)},{headers:{'Cache-Control':'no-store'}})}
