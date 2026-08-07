'use client';
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {DashboardShell} from '@/components/DashboardShell';
import {ProtectedPage} from '@/components/auth/ProtectedPage';
import {listContent,subscribeContent} from '@/lib/cms/store';
import type {ContentRecord} from '@/lib/cms/types';

const contentTypes=[
 {name:'Artikel Ilmiah Populer',icon:'✦',desc:'Jelaskan temuan ilmiah dengan bahasa yang mudah dipahami.'},
 {name:'Materi Kuliah',icon:'▤',desc:'Susun bahan pembelajaran untuk mahasiswa dan pembaca umum.'},
 {name:'Berita Sains',icon:'◎',desc:'Sampaikan perkembangan sains dan teknologi terbaru.'},
 {name:'Video Pembelajaran',icon:'▶',desc:'Bagikan video pembelajaran atau tautan YouTube.'},
];
const statusLabel:Record<string,string>={DRAFT:'Draf',READY:'Siap',SUBMITTED:'Dikirim',REVIEW:'Sedang Ditinjau',REVISION:'Perlu Revisi',ACCEPTED:'Disetujui',SCHEDULED:'Terjadwal',PUBLISHED:'Terbit',ARCHIVED:'Diarsipkan'};
export default function AuthorDashboard(){
 const [rows,setRows]=useState<ContentRecord[]>([]);
 useEffect(()=>{const load=()=>setRows(listContent());load();return subscribeContent(load)},[]);
 const summary=useMemo(()=>({total:rows.length,review:rows.filter(x=>['SUBMITTED','REVIEW'].includes(x.status)).length,published:rows.filter(x=>x.status==='PUBLISHED').length,draft:rows.filter(x=>x.status==='DRAFT').length}),[rows]);
 return <ProtectedPage roles={['AUTHOR','SENIOR_AUTHOR']} title="Halaman Penulis"><DashboardShell type="author">
  <div className="dash-top"><div><span className="eyebrow">RUANG PENULIS</span><h1 className="serif">Selamat datang kembali</h1></div><Link className="btn btn-primary" href="/dashboard/author/create">＋ Buat Artikel</Link></div>
  <div className="stats">{[['Total Artikel',summary.total],['Sedang Ditinjau',summary.review],['Sudah Terbit',summary.published],['Draf',summary.draft]].map(x=><div className="stat" key={String(x[0])}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</div>
  <section className="author-content-types"><div className="dashboard-section-title"><div><span>PILIHAN KONTEN</span><h2 className="serif">Pilih jenis konten yang akan dibuat</h2></div><Link href="/dashboard/author/create">Buka halaman penulisan →</Link></div><div className="content-type-grid">{contentTypes.map(x=><Link href={`/dashboard/author/create?type=${encodeURIComponent(x.name)}`} key={x.name}><i>{x.icon}</i><h3>{x.name}</h3><p>{x.desc}</p><span>Mulai menulis →</span></Link>)}</div></section>
  <div className="table"><div className="table-row head"><span>Artikel</span><span>Status</span><span>Diperbarui</span><span></span></div>{rows.length?rows.slice(0,8).map(r=><div className="table-row" key={r.id}><strong>{r.title||'Tanpa judul'}</strong><span className="status">{statusLabel[r.status]||r.status}</span><span>{new Date(r.updatedAt).toLocaleDateString('id-ID')}</span><Link href={`/dashboard/author/create?edit=${r.id}`}>Buka</Link></div>):<div className="empty-state"><b>Belum ada artikel.</b><span>Mulai dengan membuat artikel baru.</span></div>}</div>
 </DashboardShell></ProtectedPage>
}
