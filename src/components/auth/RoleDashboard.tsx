'use client';
import Link from 'next/link';
import {ProtectedPage} from './ProtectedPage';
import {Role,roleLabels} from '@/lib/auth/types';
import {useAuth} from './AuthProvider';

type Props={roles:Role[];title:string;subtitle:string;cards:{label:string;value:string;note:string}[];links:{label:string;href:string}[]};
export default function RoleDashboard({roles,title,subtitle,cards,links}:Props){
 const {user,logout,sessions,revokeSession,audit,approveContributor}=useAuth();
 return <ProtectedPage roles={roles} title={title}><div className="role-dashboard"><header className="role-dashboard-head"><div><span className="eyebrow">HALAMAN PENGGUNA</span><h1 className="serif">{title}</h1><p>{subtitle}</p></div><div className="role-user"><b>{user?.name}</b><span>{user?roleLabels[user.role]:''}</span><button onClick={logout}>Keluar</button></div></header><section className="role-cards">{cards.map(c=><article key={c.label}><span>{c.label}</span><strong>{c.value}</strong><small>{c.note}</small></article>)}</section><section className="role-layout"><div className="role-panel"><h2>Akses utama</h2><div className="role-links">{links.map(l=><Link key={l.href} href={l.href}>{l.label}<span>→</span></Link>)}</div>{user?.applicationStatus==='PENDING'&&<div className="pending-box"><b>Pengajuan sebagai kontributor sedang ditinjau</b><p>Pengajuan akan diperiksa oleh tim editorial.</p><button className="btn btn-primary" onClick={approveContributor}>Setujui pengajuan</button></div>}</div><div className="role-panel"><h2>Sesi aktif</h2>{sessions.length?sessions.map(s=><div className="session-row" key={s.id}><div><b>{s.device}</b><small>{new Date(s.lastSeen).toLocaleString()}</small></div><button disabled={s.current} onClick={()=>revokeSession(s.id)}>{s.current?'Sesi ini':'Cabut'}</button></div>):<p>Belum ada sesi tersimpan.</p>}<h2 className="audit-title">Riwayat keamanan akun</h2>{audit.slice(0,6).map(a=><div className="audit-row" key={a.id}><b>{a.action}</b><span>{a.detail}</span><small>{new Date(a.at).toLocaleString()}</small></div>)}</div></section></div></ProtectedPage>;
}
