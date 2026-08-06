'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {DemoUser,Role,roleDashboard} from '@/lib/auth/types';
import {initializePersistence} from '@/lib/cms/persistence';

type Audit={id:string;action:string;email?:string;role?:Role;at:string;detail:string};
type Session={id:string;device:string;lastSeen:string;current:boolean};
type AuthContextValue={user:DemoUser|null;ready:boolean;login:(email:string,password:string,role?:Role)=>{ok:boolean;redirect?:string;error?:string};register:(name:string,email:string,password:string,institution?:string)=>{ok:boolean};verifyEmail:()=>void;logout:()=>void;applyContributor:(motivation:string)=>void;approveContributor:()=>void;completeProfile:(patch:Partial<DemoUser>)=>void;sessions:Session[];revokeSession:(id:string)=>void;audit:Audit[]};
const C=createContext<AuthContextValue|null>(null);
const USER_KEY='sn360-demo-user',AUDIT_KEY='sn360-auth-audit',SESSION_KEY='sn360-sessions';
const now=()=>new Date().toISOString();
const read=<T,>(key:string,fallback:T):T=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}};
export function AuthProvider({children}:{children:React.ReactNode}){
 const [user,setUser]=useState<DemoUser|null>(null),[ready,setReady]=useState(false),[audit,setAudit]=useState<Audit[]>([]),[sessions,setSessions]=useState<Session[]>([]);
 useEffect(()=>{void initializePersistence().finally(()=>{setUser(read(USER_KEY,null));setAudit(read(AUDIT_KEY,[]));setSessions(read(SESSION_KEY,[]));setReady(true)});},[]);
 const persistAudit=(a:Audit)=>setAudit(prev=>{const next=[a,...prev].slice(0,100);localStorage.setItem(AUDIT_KEY,JSON.stringify(next));return next});
 const persistUser=(u:DemoUser|null)=>{setUser(u);if(u)localStorage.setItem(USER_KEY,JSON.stringify(u));else localStorage.removeItem(USER_KEY)};
 const login=(email:string,password:string,role?:Role)=>{
  if(!email||password.length<6){persistAudit({id:crypto.randomUUID(),action:'LOGIN_FAILED',email,role,at:now(),detail:'Invalid email or password format'});return {ok:false,error:'Email dan password tidak valid.'}};
  const lower=email.toLowerCase();const inferredRole:Role=lower.includes('system')?'SYSTEM_ADMINISTRATOR':lower.includes('admin')?'ADMINISTRATOR':lower.includes('publisher')?'PUBLISHER':lower.includes('editor')?'MANAGING_EDITOR':lower.includes('reviewer')?'REVIEWER':lower.includes('reader')?'READER':lower.includes('contributor')?'CONTRIBUTOR':'AUTHOR';const finalRole=role||inferredRole;
  const u:DemoUser={id:crypto.randomUUID(),name:email.split('@')[0].replace(/[._-]/g,' '),email,role:finalRole,verified:true,profileComplete:true,applicationStatus:finalRole==='READER'?'NONE':'APPROVED'};
  persistUser(u);const ss:Session[]=[{id:crypto.randomUUID(),device:navigator.userAgent.includes('Mac')?'Peramban Mac':'Peramban saat ini',lastSeen:now(),current:true},...sessions.map(s=>({...s,current:false}))].slice(0,5);setSessions(ss);localStorage.setItem(SESSION_KEY,JSON.stringify(ss));persistAudit({id:crypto.randomUUID(),action:'LOGIN_SUCCESS',email,role:finalRole,at:now(),detail:'Berhasil masuk ke akun'});return {ok:true,redirect:roleDashboard[finalRole]};
 };
 const register=(name:string,email:string,password:string,institution='')=>{if(!name||!email||!institution||password.length<8)return {ok:false};persistUser({id:crypto.randomUUID(),name,email,role:'CONTRIBUTOR',verified:false,profileComplete:false,applicationStatus:'APPROVED',institution});persistAudit({id:crypto.randomUUID(),action:'AUTHOR_REGISTERED',email,role:'CONTRIBUTOR',at:now(),detail:'Contributor account created; email verification pending'});return {ok:true}};
 const verifyEmail=()=>{if(!user)return;persistUser({...user,verified:true});persistAudit({id:crypto.randomUUID(),action:'EMAIL_VERIFIED',email:user.email,role:user.role,at:now(),detail:'Alamat email berhasil diverifikasi'})};
 const logout=()=>{if(user)persistAudit({id:crypto.randomUUID(),action:'LOGOUT',email:user.email,role:user.role,at:now(),detail:'Session ended'});persistUser(null)};
 const applyContributor=(motivation:string)=>{if(!user)return;persistUser({...user,applicationStatus:'PENDING'});persistAudit({id:crypto.randomUUID(),action:'CONTRIBUTOR_APPLICATION_SUBMITTED',email:user.email,role:user.role,at:now(),detail:motivation.slice(0,120)||'Application submitted'})};
 const approveContributor=()=>{if(!user)return;const u={...user,role:'CONTRIBUTOR' as Role,applicationStatus:'APPROVED' as const};persistUser(u);persistAudit({id:crypto.randomUUID(),action:'CONTRIBUTOR_APPLICATION_APPROVED',email:u.email,role:u.role,at:now(),detail:'Prototype approval granted'})};
 const completeProfile=(patch:Partial<DemoUser>)=>{if(!user)return;const u={...user,...patch,profileComplete:true};persistUser(u);persistAudit({id:crypto.randomUUID(),action:'PROFILE_COMPLETED',email:u.email,role:u.role,at:now(),detail:'Profile completion saved'})};
 const revokeSession=(id:string)=>{const ss=sessions.filter(s=>s.id!==id);setSessions(ss);localStorage.setItem(SESSION_KEY,JSON.stringify(ss));persistAudit({id:crypto.randomUUID(),action:'SESSION_REVOKED',email:user?.email,role:user?.role,at:now(),detail:'Sesi lain telah dihentikan'})};
 const value=useMemo(()=>({user,ready,login,register,verifyEmail,logout,applyContributor,approveContributor,completeProfile,sessions,revokeSession,audit}),[user,ready,sessions,audit]);
 return <C.Provider value={value}>{children}</C.Provider>;
}
export function useAuth(){const v=useContext(C);if(!v)throw new Error('useAuth requires AuthProvider');return v}
