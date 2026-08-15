'use client';

import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {DashboardShell} from '@/components/DashboardShell';
import {ProtectedPage} from '@/components/auth/ProtectedPage';
import {useAuth} from '@/components/auth/AuthProvider';
import {listContentForAuthor,subscribeContent} from '@/lib/cms/store';
import type {ContentRecord} from '@/lib/cms/types';

const statusLabel:Record<string,string>={
  DRAFT:'Draf',
  READY:'Siap',
  SUBMITTED:'Dikirim',
  REVIEW:'Sedang Ditinjau',
  REVISION:'Perlu Revisi',
  ACCEPTED:'Disetujui',
  SCHEDULED:'Terjadwal',
  PUBLISHED:'Terbit',
  ARCHIVED:'Diarsipkan'
};

const typeLabel:Record<string,string>={
  SCIENCE_NEWS:'Berita Sains',
  POPULAR_ARTICLE:'Artikel Ilmiah Populer',
  RESEARCH_HIGHLIGHT:'Research Highlight',
  OPINION:'Opini',
  COURSE_MATERIAL:'Materi Kuliah',
  LEARNING_MODULE:'Modul Pembelajaran',
  ACADEMIC_TUTORIAL:'Tutorial Akademik',
  LEARNING_VIDEO:'Video Pembelajaran',
  INSTITUTION_NEWS:'Berita Institusi'
};

function formatDate(value:string){
  try{
    return new Intl.DateTimeFormat('id-ID',{
      day:'numeric',
      month:'short',
      year:'numeric'
    }).format(new Date(value));
  }catch{
    return value;
  }
}

export default function AuthorDashboard(){
  const {user}=useAuth();
  const [rows,setRows]=useState<ContentRecord[]>([]);

  useEffect(()=>{
    const load=async()=>{
      try{
        const response=await fetch(
          '/api/cms',
          {cache:'no-store'}
        );

        if(response.ok){
          const payload=await response.json();

          setRows(
            Array.isArray(payload.content)
              ?payload.content
              :[]
          );

          return;
        }
      }catch{}

      setRows(listContentForAuthor(user?.email));
    };

    void load();

    return subscribeContent(()=>void load());
  },[user?.email]);

  const summary=useMemo(()=>({
    total:rows.length,
    review:rows.filter(x=>['SUBMITTED','REVIEW'].includes(x.status)).length,
    published:rows.filter(x=>x.status==='PUBLISHED').length,
    draft:rows.filter(x=>x.status==='DRAFT').length
  }),[rows]);

  const latest=useMemo(
    ()=>[...rows]
      .sort((a,b)=>new Date(b.updatedAt).getTime()-new Date(a.updatedAt).getTime())
      .slice(0,4),
    [rows]
  );

  const displayName=user?.name?.trim()||'Penulis';
  const initials=displayName
    .split(/\s+/)
    .slice(0,2)
    .map(x=>x[0]?.toUpperCase())
    .join('');

  return (
    <ProtectedPage
      roles={['AUTHOR','SENIOR_AUTHOR','SYSTEM_ADMINISTRATOR']}
      title="Halaman Penulis"
    >
      <DashboardShell type="author">
        <main className="author-pro">

          <section className="author-hero">
            <div className="hero-content">
              <div className="hero-kicker">
                <span className="rocket">↗</span>
                RUANG PENULIS SCIENCE NEWS 360
              </div>

              <h1>
                Selamat datang kembali,
                <span>{displayName}!</span>
              </h1>

              <p>
                Terus bagikan ide, penelitian, dan wawasan ilmiah terbaik Anda
                untuk membangun masyarakat yang lebih cerdas dan inovatif.
              </p>

              <div className="hero-actions">
                <Link className="hero-primary" href="/dashboard/author/create">
                  <b>＋</b>
                  Buat Artikel Baru
                  <span>→</span>
                </Link>

                <Link className="hero-secondary" href="/dashboard/author/content">
                  <span>▤</span>
                  Lihat Konten Saya
                </Link>
              </div>
            </div>

            <div className="science-art" aria-hidden="true">
              <div className="orbit orbit-a"></div>
              <div className="orbit orbit-b"></div>
              <div className="atom-core"></div>
              <div className="dna">
                <i></i><i></i><i></i><i></i><i></i><i></i>
              </div>
            </div>
          </section>

          <section className="metric-grid">
            <article className="metric-card">
              <div className="metric-icon blue">▤</div>
              <div>
                <span>Total Artikel</span>
                <strong>{summary.total}</strong>
                <small>Seluruh artikel yang Anda buat</small>
              </div>
            </article>

            <article className="metric-card">
              <div className="metric-icon violet">⌛</div>
              <div>
                <span>Sedang Ditinjau</span>
                <strong>{summary.review}</strong>
                <small>Dalam proses peninjauan redaksi</small>
              </div>
            </article>

            <article className="metric-card">
              <div className="metric-icon cyan">◈</div>
              <div>
                <span>Sudah Terbit</span>
                <strong>{summary.published}</strong>
                <small>Artikel yang telah dipublikasikan</small>
              </div>
            </article>

            <article className="metric-card">
              <div className="metric-icon orange">✎</div>
              <div>
                <span>Draf</span>
                <strong>{summary.draft}</strong>
                <small>Masih dalam tahap penulisan</small>
              </div>
            </article>
          </section>

          <section className="author-lower-grid">

            <article className="activity-panel">
              <div className="panel-heading">
                <div className="heading-title">
                  <div className="heading-icon">▤</div>
                  <div>
                    <h2>Aktivitas Terbaru</h2>
                    <p>Lanjutkan penulisan atau lihat perkembangan artikel Anda</p>
                  </div>
                </div>

                <Link href="/dashboard/author/content">
                  Lihat Semua <span>→</span>
                </Link>
              </div>

              <div className="activity-list">
                {latest.length ? latest.map((r,index)=>(
                  <Link
                    href={`/dashboard/author/create?edit=${r.id}`}
                    className="activity-row"
                    key={r.id}
                  >
                    <div className={`activity-thumb thumb-${index%4}`}>
                      <span>{typeLabel[r.type]?.slice(0,1)||'S'}</span>
                    </div>

                    <div className="activity-main">
                      <strong>{r.title||'Tanpa judul'}</strong>
                      <div className="badges">
                        <span className="type-badge">
                          {typeLabel[r.type]||r.type}
                        </span>
                        <span className={`status-badge status-${r.status.toLowerCase()}`}>
                          {statusLabel[r.status]||r.status}
                        </span>
                      </div>
                    </div>

                    <time>{formatDate(r.updatedAt)}</time>
                  </Link>
                )) : (
                  <div className="activity-empty">
                    <div>✦</div>
                    <h3>Belum ada artikel</h3>
                    <p>Mulai tulis artikel pertama Anda untuk Science News 360.</p>
                    <Link href="/dashboard/author/create">Buat Artikel Baru</Link>
                  </div>
                )}
              </div>
            </article>

            <aside className="guide-panel">
              <div className="panel-heading guide-heading">
                <div className="heading-title">
                  <div className="heading-icon bulb">☼</div>
                  <div>
                    <h2>Panduan Penulisan</h2>
                  </div>
                </div>
                <Link href="/id/info/author-guidelines">Lihat Semua →</Link>
              </div>

              <div className="guide-highlight">
                <span>◇</span>
                <b>Tips untuk penulisan artikel yang berkualitas</b>
              </div>

              <ul>
                <li><span>✓</span>Gunakan bahasa yang jelas dan mudah dipahami</li>
                <li><span>✓</span>Sertakan referensi dari sumber ilmiah terpercaya</li>
                <li><span>✓</span>Lengkapi dengan gambar/ilustrasi yang relevan</li>
                <li><span>✓</span>Ikuti panduan editorial Science News 360</li>
              </ul>

              <Link className="guide-button" href="/id/info/author-guidelines">
                <span>▥</span>
                Lihat Panduan Lengkap
                <b>→</b>
              </Link>

              <div className="author-mini-profile">
                <div className="mini-avatar">{initials}</div>
                <div>
                  <b>{displayName}</b>
                  <span>{user?.institution||'Science News 360 Author'}</span>
                </div>
              </div>
            </aside>

          </section>

          <style jsx>{`
            .author-pro{
              --navy:#071e36;
              --ink:#102033;
              --muted:#64748b;
              --line:#e3eaf3;
              --blue:#146bff;
              --blue2:#0c45c8;
              width:100%;
              padding:22px 30px 38px;
              color:var(--ink);
              background:
                radial-gradient(circle at 92% 5%,rgba(45,130,255,.08),transparent 26%),
                #f4f8fd;
              min-height:calc(100vh - 60px);
            }

            .author-hero{
              position:relative;
              display:flex;
              min-height:226px;
              border-radius:18px;
              overflow:hidden;
              background:
                linear-gradient(110deg,#f5fbff 0%,#e8f5ff 38%,#b9dcff 75%,#7fb6f4 100%);
              border:1px solid rgba(79,144,217,.14);
              box-shadow:0 10px 35px rgba(39,78,126,.06);
            }

            .hero-content{
              position:relative;
              z-index:3;
              width:62%;
              padding:35px 38px;
            }

            .hero-kicker{
              display:flex;
              align-items:center;
              gap:9px;
              font-size:13px;
              font-weight:800;
              letter-spacing:.02em;
              color:#1766e7;
              margin-bottom:14px;
            }

            .rocket{
              display:inline-grid;
              place-items:center;
              width:22px;
              height:22px;
              border-radius:7px;
              color:white;
              background:#146bff;
            }

            .author-hero h1{
              margin:0;
              max-width:720px;
              font-family:Georgia,'Times New Roman',serif;
              font-size:36px;
              line-height:1.12;
              letter-spacing:-.02em;
              color:#102033;
            }

            .author-hero h1 span{
              margin-left:8px;
              color:#1766e7;
            }

            .author-hero p{
              max-width:700px;
              margin:16px 0 24px;
              font-size:15px;
              line-height:1.65;
              color:#53657a;
            }

            .hero-actions{
              display:flex;
              align-items:center;
              gap:14px;
            }

            .hero-primary,
            .hero-secondary{
              min-height:46px;
              display:inline-flex;
              align-items:center;
              justify-content:center;
              gap:12px;
              padding:0 24px;
              border-radius:999px;
              text-decoration:none;
              font-weight:800;
              transition:.2s ease;
            }

            .hero-primary{
              min-width:220px;
              color:#fff;
              background:linear-gradient(135deg,#1784ff,#063fc6);
              box-shadow:0 10px 24px rgba(20,107,255,.22);
            }

            .hero-primary:hover{
              transform:translateY(-1px);
              box-shadow:0 13px 27px rgba(20,107,255,.28);
            }

            .hero-secondary{
              min-width:190px;
              color:#12243a;
              background:rgba(255,255,255,.72);
              border:1px solid rgba(255,255,255,.8);
              backdrop-filter:blur(8px);
            }

            .science-art{
              position:absolute;
              inset:0 0 0 auto;
              width:45%;
              overflow:hidden;
              opacity:.92;
            }

            .science-art:before{
              content:'';
              position:absolute;
              width:370px;
              height:370px;
              right:-60px;
              top:-80px;
              border-radius:50%;
              background:
                radial-gradient(circle at 45% 45%,rgba(255,255,255,.75),transparent 13%),
                repeating-radial-gradient(circle,rgba(255,255,255,.14) 0 2px,transparent 2px 18px);
            }

            .orbit{
              position:absolute;
              border:2px solid rgba(255,255,255,.48);
              border-radius:50%;
              transform:rotate(-18deg);
            }

            .orbit-a{
              width:230px;
              height:95px;
              right:30px;
              bottom:35px;
            }

            .orbit-b{
              width:95px;
              height:230px;
              right:96px;
              bottom:-32px;
            }

            .atom-core{
              position:absolute;
              width:28px;
              height:28px;
              right:130px;
              bottom:76px;
              border-radius:50%;
              background:#fff;
              box-shadow:0 0 26px rgba(255,255,255,.85);
            }

            .dna{
              position:absolute;
              right:250px;
              top:32px;
              width:130px;
              height:190px;
              transform:rotate(18deg);
              opacity:.72;
            }

            .dna:before,
            .dna:after{
              content:'';
              position:absolute;
              top:0;
              width:22px;
              height:100%;
              border:3px solid rgba(255,255,255,.55);
              border-top:none;
              border-bottom:none;
              border-radius:50%;
            }

            .dna:before{left:26px;transform:rotate(13deg)}
            .dna:after{right:26px;transform:rotate(-13deg)}

            .dna i{
              position:relative;
              display:block;
              width:78px;
              height:2px;
              margin:23px auto;
              background:rgba(255,255,255,.55);
              transform:rotate(-11deg);
            }

            .metric-grid{
              display:grid;
              grid-kerangka-columns:repeat(4,minmax(0,1fr));
              gap:16px;
              margin:18px 0;
            }

            .metric-card{
              display:flex;
              align-items:center;
              gap:18px;
              min-height:118px;
              padding:22px;
              background:#fff;
              border:1px solid var(--line);
              border-radius:16px;
              box-shadow:0 7px 24px rgba(33,65,102,.045);
            }

            .metric-icon{
              flex:0 0 52px;
              height:52px;
              display:grid;
              place-items:center;
              border-radius:15px;
              font-size:24px;
              font-weight:800;
            }

            .metric-icon.blue{background:#e6f1ff;color:#1766e7}
            .metric-icon.violet{background:#eceaff;color:#665af0}
            .metric-icon.cyan{background:#e2f5ff;color:#1599db}
            .metric-icon.orange{background:#fff0df;color:#f08a21}

            .metric-card div:last-child{
              display:flex;
              flex-direction:column;
            }

            .metric-card span{
              font-size:14px;
              color:#52657b;
            }

            .metric-card strong{
              margin:3px 0 4px;
              font-size:30px;
              line-height:1;
              letter-spacing:-.03em;
            }

            .metric-card small{
              color:#728197;
              font-size:12px;
            }

            .author-lower-grid{
              display:grid;
              grid-kerangka-columns:minmax(0,1.9fr) minmax(300px,.9fr);
              gap:18px;
            }

            .activity-panel,
            .guide-panel{
              background:#fff;
              border:1px solid var(--line);
              border-radius:17px;
              box-shadow:0 8px 28px rgba(33,65,102,.045);
              overflow:hidden;
            }

            .panel-heading{
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:20px;
              padding:22px 24px 16px;
            }

            .heading-title{
              display:flex;
              align-items:center;
              gap:14px;
            }

            .heading-icon{
              width:42px;
              height:42px;
              display:grid;
              place-items:center;
              border-radius:13px;
              color:#31536f;
              background:#eef4fa;
              font-size:20px;
            }

            .heading-icon.bulb{
              background:#fff4da;
              color:#e69b00;
            }

            .panel-heading h2{
              margin:0;
              font-size:19px;
              letter-spacing:-.02em;
            }

            .panel-heading p{
              margin:3px 0 0;
              color:#718197;
              font-size:13px;
            }

            .panel-heading>a{
              color:#1265e9;
              text-decoration:none;
              font-size:13px;
              font-weight:800;
              white-space:nowrap;
            }

            .activity-list{
              padding:0 24px 16px;
            }

            .activity-row{
              display:grid;
              grid-kerangka-columns:78px minmax(0,1fr) auto;
              gap:15px;
              align-items:center;
              min-height:82px;
              border-top:1px solid #e9eef5;
              text-decoration:none;
              color:inherit;
              transition:.2s ease;
            }

            .activity-row:hover{
              background:#f9fbfe;
              margin:0 -10px;
              padding:0 10px;
              border-radius:12px;
            }

            .activity-thumb{
              width:74px;
              height:52px;
              display:grid;
              place-items:center;
              border-radius:10px;
              overflow:hidden;
              color:#fff;
              font-family:Georgia,serif;
              font-size:23px;
              font-weight:700;
              box-shadow:inset 0 0 0 1px rgba(255,255,255,.2);
            }

            .thumb-0{background:linear-gradient(135deg,#082d57,#1c8cf5)}
            .thumb-1{background:linear-gradient(135deg,#123f4b,#42a79c)}
            .thumb-2{background:linear-gradient(135deg,#321a58,#8f5ce8)}
            .thumb-3{background:linear-gradient(135deg,#7e3a19,#e1884c)}

            .activity-main{
              min-width:0;
            }

            .activity-main>strong{
              display:block;
              margin-bottom:8px;
              font-size:14px;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
            }

            .badges{
              display:flex;
              gap:7px;
              flex-wrap:wrap;
            }

            .type-badge,
            .status-badge{
              display:inline-flex;
              align-items:center;
              min-height:22px;
              padding:0 9px;
              border-radius:7px;
              font-size:11px;
              font-weight:800;
            }

            .type-badge{
              color:#1c5fc4;
              background:#eaf3ff;
            }

            .status-badge{
              color:#9a6300;
              background:#fff0d8;
            }

            .status-published{
              color:#168548;
              background:#e3f8ea;
            }

            .status-submitted,
            .status-review{
              color:#5f55c7;
              background:#eceaff;
            }

            .activity-row time{
              font-size:12px;
              color:#6d7d90;
              white-space:nowrap;
            }

            .activity-empty{
              padding:42px 20px 48px;
              text-align:center;
              border-top:1px solid #e9eef5;
            }

            .activity-empty>div{
              font-size:28px;
              color:#146bff;
            }

            .activity-empty h3{
              margin:10px 0 4px;
            }

            .activity-empty p{
              margin:0 0 16px;
              color:#718197;
            }

            .activity-empty a{
              display:inline-flex;
              padding:10px 16px;
              border-radius:9px;
              background:#146bff;
              color:#fff;
              text-decoration:none;
              font-weight:700;
            }

            .guide-panel{
              padding-bottom:18px;
            }

            .guide-heading{
              padding-bottom:12px;
            }

            .guide-highlight{
              display:flex;
              align-items:center;
              gap:10px;
              margin:0 22px 15px;
              padding:13px 14px;
              border:1px solid #b8dbff;
              background:#eaf6ff;
              border-radius:9px;
              color:#154d8c;
              font-size:13px;
            }

            .guide-highlight span{
              font-size:19px;
              color:#146bff;
            }

            .guide-panel ul{
              display:grid;
              gap:12px;
              padding:0 24px;
              margin:0 0 19px;
              list-style:none;
            }

            .guide-panel li{
              display:flex;
              align-items:flex-start;
              gap:10px;
              color:#35475b;
              font-size:13px;
              line-height:1.45;
            }

            .guide-panel li span{
              display:grid;
              place-items:center;
              flex:0 0 18px;
              height:18px;
              margin-top:1px;
              border:2px solid #24b55c;
              border-radius:50%;
              color:#24b55c;
              font-size:10px;
              font-weight:900;
            }

            .guide-button{
              display:flex;
              align-items:center;
              justify-content:center;
              gap:10px;
              margin:0 22px;
              height:46px;
              border:1.5px solid #146bff;
              border-radius:9px;
              color:#146bff;
              text-decoration:none;
              font-size:13px;
              font-weight:800;
            }

            .guide-button b{
              margin-left:auto;
              margin-right:18px;
            }

            .author-mini-profile{
              display:flex;
              align-items:center;
              gap:11px;
              margin:20px 22px 0;
              padding-top:18px;
              border-top:1px solid #e9eef5;
            }

            .mini-avatar{
              width:38px;
              height:38px;
              display:grid;
              place-items:center;
              border-radius:50%;
              background:linear-gradient(135deg,#174d9e,#1269f4);
              color:#fff;
              font-weight:800;
              font-size:12px;
            }

            .author-mini-profile>div:last-child{
              display:flex;
              flex-direction:column;
              min-width:0;
            }

            .author-mini-profile b{
              font-size:13px;
            }

            .author-mini-profile span{
              color:#7b899b;
              font-size:11px;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
            }

            @media(max-width:1100px){
              .hero-content{width:72%}
              .science-art{width:38%}
              .metric-grid{grid-kerangka-columns:repeat(2,minmax(0,1fr))}
              .author-lower-grid{grid-kerangka-columns:1fr}
            }

            @media(max-width:720px){
              .author-pro{padding:16px}
              .author-hero{min-height:auto}
              .hero-content{width:100%;padding:28px 24px}
              .science-art{opacity:.24;width:70%}
              .author-hero h1{font-size:30px}
              .hero-actions{align-items:stretch;flex-direction:column}
              .hero-primary,.hero-secondary{width:100%}
              .metric-grid{grid-kerangka-columns:1fr}
              .activity-row{grid-kerangka-columns:60px minmax(0,1fr)}
              .activity-row time{display:none}
              .activity-thumb{width:58px;height:45px}
            }
          `}</style>

        </main>
      </DashboardShell>
    </ProtectedPage>
  );
}
