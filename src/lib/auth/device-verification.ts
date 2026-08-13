import {promises as fs} from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type DeviceChallenge={
 token:string;
 status:'PENDING'|'VERIFIED'|'EXPIRED';
 createdAt:string;
 expiresAt:string;
 verifiedAt?:string;
};

type Db={challenges:Record<string,DeviceChallenge>};

const FILE=path.join(process.cwd(),'.sn360-data','device-verification.json');
const STORE='sn360-device-verification-v1';

function useNetlify(){
 return Boolean(
  process.env.NETLIFY||
  process.env.CONTEXT||
  process.env.NETLIFY_SITE_ID||
  process.env.SITE_ID||
  process.env.SITE_NAME
 );
}

async function readLocal():Promise<Db>{
 try{
  return JSON.parse(await fs.readFile(FILE,'utf8')) as Db;
 }catch{
  return {challenges:{}};
 }
}

async function writeLocal(db:Db){
 await fs.mkdir(path.dirname(FILE),{recursive:true});
 await fs.writeFile(FILE,JSON.stringify(db,null,2),'utf8');
}

async function store(){
 const {getStore}=await import('@netlify/blobs');
 return getStore({name:STORE,consistency:'strong'});
}

export function createToken(){
 return crypto.randomBytes(32).toString('hex');
}

export async function createChallenge(){
 const token=createToken();
 const createdAt=new Date();
 const expiresAt=new Date(createdAt.getTime()+10*60*1000);

 const row:DeviceChallenge={
  token,
  status:'PENDING',
  createdAt:createdAt.toISOString(),
  expiresAt:expiresAt.toISOString()
 };

 if(useNetlify()){
  const s=await store();
  await s.setJSON(`challenge:${token}`,row);
 }else{
  const db=await readLocal();
  db.challenges[token]=row;
  await writeLocal(db);
 }

 return row;
}

export async function getChallenge(token:string):Promise<DeviceChallenge|null>{
 let row:DeviceChallenge|null=null;

 if(useNetlify()){
  const s=await store();
  row=await s.get(`challenge:${token}`,{
   type:'json',
   consistency:'strong'
  }) as DeviceChallenge|null;
 }else{
  const db=await readLocal();
  row=db.challenges[token]||null;
 }

 if(!row)return null;

 if(
  row.status==='PENDING' &&
  new Date(row.expiresAt).getTime()<Date.now()
 ){
  row.status='EXPIRED';
  await saveChallenge(row);
 }

 return row;
}

async function saveChallenge(row:DeviceChallenge){
 if(useNetlify()){
  const s=await store();
  await s.setJSON(`challenge:${row.token}`,row);
 }else{
  const db=await readLocal();
  db.challenges[row.token]=row;
  await writeLocal(db);
 }
}

export async function confirmChallenge(token:string){
 const row=await getChallenge(token);

 if(!row)return null;
 if(row.status==='EXPIRED')return row;

 if(row.status==='PENDING'){
  row.status='VERIFIED';
  row.verifiedAt=new Date().toISOString();
  await saveChallenge(row);
 }

 return row;
}
