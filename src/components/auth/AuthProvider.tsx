'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import type {Role,AuthUser} from '@/lib/auth/types';
import {roleDashboard} from '@/lib/auth/types';
import {initializePersistence} from '@/lib/cms/persistence';

type Audit={id:string;action:string;email?:string;role?:Role;at:string;detail:string};
type Session={id:string;device:string;lastSeen:string;current:boolean};
type Result={ok:boolean;redirect?:string;error?:string};
type AuthContextValue={user:AuthUser|null;ready:boolean;login:(email:string,password:string,role?:Role)=>Promise<Result>;register:(name:string,email:string,password:string,institution?:string)=>Promise<Result>;verifyEmail:()=>void;logout:()=>Promise<void>;applyContributor:(motivation:string)=>void;approveContributor:()=>void;completeProfile:(patch:Partial<AuthUser>)=>void;sessions:Session[];revokeSession:(id:string)=>void;audit:Audit[];refresh:()=>Promise<void>};
const C=createContext<AuthContextValue|null>(null);
export function AuthProvider({children}:{children:React.ReactNode}){
 const [user,setUser]=useState<AuthUser|null>(null),[ready,setReady]=useState(false);
 const refresh=async()=>{try{const r=await fetch('/api/auth/session',{cache:'no-store'});const d=await r.json();setUser(d.user||null)}catch{setUser(null)}finally{setReady(true)}};
 useEffect(()=>{try{localStorage.removeItem('sn360-demo-user');localStorage.removeItem('sn360-auth-audit');localStorage.removeItem('sn360-sessions')}catch{}void refresh().then(()=>initializePersistence())},[]);
 const login=async(email:string,password:string,requestedRole?:Role)=>{try{const adminOnly=requestedRole==='ADMINISTRATOR';const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,adminOnly})});const d=await r.json();if(!r.ok)return {ok:false,error:d.error||'Login gagal.'};if(adminOnly&&!['ADMINISTRATOR','SYSTEM_ADMINISTRATOR'].includes(d.user.role)){return {ok:false,error:'Anda tidak diizinkan mengakses area Administrator.'}}setUser(d.user);await initializePersistence();const redirect=adminOnly?'/dashboard/admin':d.user.role==='SYSTEM_ADMINISTRATOR'?'/dashboard/author':roleDashboard[d.user.role as Role];return {ok:true,redirect}}catch{return {ok:false,error:'Tidak dapat menghubungi layanan login.'}}};
 const register=async(name:string,email:string,password:string,institution='')=>{try{const r=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password,institution})});const d=await r.json();return r.ok?{ok:true}:{ok:false,error:d.error||'Pendaftaran gagal.'}}catch{return {ok:false,error:'Tidak dapat menghubungi layanan pendaftaran.'}}};
 const logout=async()=>{try{await fetch('/api/auth/logout',{method:'POST'})}finally{setUser(null);location.href='/id'}};
 const completeProfile=(patch:Partial<AuthUser>)=>setUser(u=>u?{...u,...patch,profileComplete:true}:u);
 const value=useMemo<AuthContextValue>(()=>({user,ready,login,register,verifyEmail:()=>{},logout,applyContributor:()=>{},approveContributor:()=>{},completeProfile,sessions:[],revokeSession:()=>{},audit:[],refresh}),[user,ready]);
 return <C.Provider value={value}>{children}</C.Provider>;
}
export function useAuth(){const v=useContext(C);if(!v)throw new Error('useAuth requires AuthProvider');return v}
