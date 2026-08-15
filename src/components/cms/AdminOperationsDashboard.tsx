'use client';
import Link from 'next/link';import {useEffect,useMemo,useState} from 'react';import {ContentRecord,ContentStatus} from '@/lib/cms/types';import {changeStatus,listContent,saveContent,subscribeContent} from '@/lib/cms/store';
const labels:Record<ContentStatus,string>={DRAFT:'Draf',READY:'Siap',SUBMITTED:'Dikirim',REVIEW:'Sedang Ditinjau',REVISION:'Perlu Revisi',ACCEPTED:'Disetujui',SCHEDULED:'Terjadwal',PUBLISHED:'Terbit',ARCHIVED:'Diarsipkan'};
const relative=(iso:string)=>{const d=Math.max(0,Date.now()-new Date(iso).getTime());const h=Math.floor(d/3600000);if(h<1)return 'Baru saja';if(h<24)return `${h} jam lalu`;return `${Math.floor(h/24)} hari lalu`};
export default function AdminOperationsDashboard(){const [rows,setRows]=useState<ContentRecord[]>([]);const [query,setQuery]=useState('');const [status,setStatus]=useState('ALL');const [analytics,setAnalytics]=useState({online:0,todayViews:0,total:0});

 const refresh=async()=>{
  try{
   const r=await fetch('/api/cms',{cache:'no-store'});
   if(r.ok){
    const d=await r.json();
    setRows(Array.isArray(d.content)?d.content:[]);
    return;
   }
  }catch{}
  setRows(listContent());
 };

 useEffect(()=>{
  void refresh();
  fetch('/api/analytics/visit',{cache:'no-store'}).then(r=>r.json()).then(setAnalytics).catch(()=>{});
  const unsub=subscribeContent(()=>void refresh());
  return unsub;
 },[]);
 const editorial=useMemo(()=>rows.filter(r=>!['DRAFT','READY','ARCHIVED'].includes(r.status)),[rows]);const visible=editorial.filter(r=>(status==='ALL'||r.status===status)&&(`${r.title} ${r.authors[0]?.name||''}`).toLowerCase().includes(query.toLowerCase()));
 const count=(s:ContentStatus)=>rows.filter(r=>r.status===s).length;const today=new Date().toDateString();const publishedToday=rows.filter(r=>r.status==='PUBLISHED'&&r.publishedAt&&new Date(r.publishedAt).toDateString()===today).length;const pending=count('SUBMITTED')+count('REVIEW');
 const exportCsv=()=>{const head=['Title','Author','Institution','Status','Priority','Updated'];const body=visible.map(r=>[r.title,r.authors[0]?.name||'',r.authors[0]?.affiliation||'',r.status,r.priority||'NORMAL',r.updatedAt]);const csv=[head,...body].map(x=>x.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='science-news-360-submissions.csv';a.click();URL.revokeObjectURL(a.href)};
 const unpublish=async(r:ContentRecord)=>{
 if(!confirm('Tarik artikel dari publikasi? Artikel akan hilang dari website publik tetapi tetap tersimpan sebagai arsip.'))return;

 try{
  const response=await fetch('/api/publications',{
   method:'DELETE',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({locale:r.locale,slug:r.slug})
  });

  const payload=await response.json();

  if(!response.ok){
   alert(payload?.error||'Artikel gagal ditarik dari publikasi.');
   return;
  }

  changeStatus(
   r.id,
   'ARCHIVED',
   'Artikel ditarik dari publikasi oleh Administrator.',
   'Administrator',
   'ADMINISTRATOR'
  );

  await refresh();
  alert('Artikel berhasil ditarik dari publikasi dan dipindahkan ke arsip.');
 }catch{
  alert('Artikel gagal ditarik dari publikasi.');
 }
};

const quick=(r:ContentRecord,action:string)=>{if(action==='priority'){saveContent({...r,priority:r.priority==='HIGH'?'NORMAL':'HIGH'},'Prioritas diubah','Administrator','ADMINISTRATOR');return}const map:Record<string,ContentStatus>={review:'REVIEW',revision:'REVISION',fact:'REVIEW',approve:'ACCEPTED',schedule:'SCHEDULED',publish:'PUBLISHED',archive:'ARCHIVED'};if(map[action])changeStatus(r.id,map[action],`Tindakan editorial: ${action}`,'Administrator','ADMINISTRATOR')};
 return <>
 <div className="admin-overview-head"><div><span className="eyebrow">PENGELOLAAN EDITORIAL</span><h1>Ringkasan Science News 360</h1><p>Data aktual dari artikel penulis dan proses editorial.</p></div><div className="admin-head-actions"><Link className="btn btn-secondary" href="/dashboard/admin/users">Kelola Pengguna</Link><Link className="btn btn-secondary" href="/dashboard/admin/social-preview">Pratinjau Berbagi</Link><Link className="btn btn-primary" href="/dashboard/admin/workflow">Buka Alur Editorial</Link></div></div>
 <section className="admin-kpi-grid"><article className="admin-kpi review"><div><span>Menunggu Peninjauan</span><strong>{pending}</strong></div><small>{pending?'Membutuhkan tindakan':'Tidak ada antrean'}</small></article><article className="admin-kpi published"><div><span>Terbit Hari Ini</span><strong>{publishedToday}</strong></div><small>Data publikasi aktual</small></article><article className="admin-kpi scheduled"><div><span>Terjadwal</span><strong>{count('SCHEDULED')}</strong></div><small>Menunggu jadwal</small></article><article className="admin-kpi readers"><div><span>Pengunjung Online</span><strong>{analytics.online}</strong></div><small>{analytics.todayViews.toLocaleString()} kunjungan hari ini · {analytics.total.toLocaleString()} total</small></article></section>
 <section className="admin-overview-grid"><article className="admin-panel workflow-panel"><div className="admin-panel-title"><div><span className="eyebrow">TAHAPAN</span><h2>Alur Editorial</h2></div><Link href="/dashboard/admin/workflow">Lihat semua →</Link></div><div className="workflow-strip">{(['SUBMITTED','REVIEW','REVISION','ACCEPTED','SCHEDULED','PUBLISHED'] as ContentStatus[]).map((s,i)=><div key={s}><span>{String(i+1).padStart(2,'0')}</span><strong>{count(s)}</strong><small>{labels[s]}</small></div>)}</div></article><article className="admin-panel urgent-panel"><div className="admin-panel-title"><div><span className="eyebrow danger">PRIORITAS</span><h2>Tugas Mendesak</h2></div><span className="urgent-count">{rows.filter(r=>r.priority==='URGENT'||r.priority==='HIGH').length}</span></div>{rows.length?<ul><li><i>!</i><span><strong>{rows.filter(r=>r.priority==='HIGH'||r.priority==='URGENT').length} artikel prioritas tinggi</strong><small>Perlu perhatian editorial</small></span></li><li><i>◷</i><span><strong>{count('SUBMITTED')} artikel baru</strong><small>Menunggu peninjau</small></span></li><li><i>✓</i><span><strong>{count('ACCEPTED')} artikel siap</strong><small>Menunggu penjadwalan/publikasi</small></span></li></ul>:<div className="compact-empty">Belum ada tugas editorial.</div>}<Link className="btn btn-dark" href="/dashboard/admin/workflow">Buka Alur Editorial</Link></article></section>
 <section className="admin-panel submissions-panel"><div className="admin-panel-title"><div><span className="eyebrow">AKTIVITAS TERBARU</span><h2>Artikel yang Baru Dikirim</h2></div><div className="table-tools"><input aria-label="Cari artikel" placeholder="Cari artikel atau penulis" value={query} onChange={e=>setQuery(e.target.value)}/><select value={status} onChange={e=>setStatus(e.target.value)}><option value="ALL">Semua status</option>{(['SUBMITTED','REVIEW','REVISION','ACCEPTED','SCHEDULED','PUBLISHED'] as ContentStatus[]).map(s=><option key={s} value={s}>{labels[s]}</option>)}</select><button onClick={exportCsv}>Unduh CSV</button></div></div>
 <div className="admin-table"><div className="admin-table-row head"><span>Artikel</span><span>Penulis</span><span>Status</span><span>Prioritas</span><span></span></div>{visible.length?visible.slice(0,20).map(r=><div className="admin-table-row" key={r.id}><div className="submission-title-cell">{r.thumbnail?.preview&&<img src={r.thumbnail.preview} alt=""/>}<div><Link href={`/dashboard/editorial/${r.id}`}><strong>{r.title}</strong></Link><small>{r.authors[0]?.affiliation||'Tanpa institusi'} · {relative(r.updatedAt)} · {r.versions?.length||0} versi</small></div></div><span>{r.authors[0]?.name||'—'}</span><span><b className={`admin-status status-${r.status.toLowerCase()}`}>{labels[r.status]}</b></span><span><button className={`priority-pill ${(r.priority||'NORMAL').toLowerCase()}`} onClick={()=>quick(r,'priority')}>{r.priority||'NORMAL'}</button></span><details className="row-actions"><summary aria-label={`Tindakan untuk ${r.title}`}>•••</summary><div onClick={e=>{const menu=e.currentTarget.closest('details');if(menu)menu.removeAttribute('open')}}><Link href={`/dashboard/editorial/${r.id}`}>Buka Ruang Editorial</Link><button onClick={()=>quick(r,'review')}>Mulai Peninjauan</button><button onClick={()=>quick(r,'revision')}>Minta Revisi</button><button onClick={()=>quick(r,'approve')}>Setujui</button><button onClick={()=>quick(r,'schedule')}>Jadwalkan</button>{r.status==='PUBLISHED'&&<button className="danger-link" onClick={()=>void unpublish(r)}>Tarik dari Publikasi</button>}<button onClick={()=>quick(r,'archive')}>Arsipkan</button></div></details></div>):<div className="dashboard-empty-state"><h3>Belum ada artikel yang dikirim</h3><p>Artikel akan tampil otomatis setelah penulis mengirimkannya untuk ditinjau.</p></div>}</div></section>
 </>}
