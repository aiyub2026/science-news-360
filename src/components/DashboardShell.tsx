'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_LINKS = [
  ['Ringkasan','/dashboard/admin','⌂'],
  ['Alur Editorial','/dashboard/admin/workflow','⇄'],
  ['Video & YouTube','/dashboard/admin/youtube','▶'],
  ['Optimasi Pencarian','/dashboard/admin/seo','◎'],
  ['Pemeriksaan Tautan Berbagi','/dashboard/admin/social-preview','▣'],
];

const AUTHOR_LINKS = [
  ['Ringkasan','/dashboard/author','⌂'],
  ['Buat Konten','/dashboard/author/create','＋'],
  ['Konten Saya','/dashboard/author/content','▤'],
  ['Galeri Media','/dashboard/author/media','▧'],
  ['Pusat Template','/dashboard/author/templates','⇩'],
  ['Profil Saya','/dashboard/author/profile','◎'],
];

export function DashboardShell({type,children}:{type:'author'|'admin',children:React.ReactNode}){
  const pathname = usePathname();
  const links = type === 'admin' ? ADMIN_LINKS : AUTHOR_LINKS;
  return (
    <div className={`dashboard dashboard-${type}`}>
      <aside className="sidebar">
        <Link className="dashboard-brand" href="/id">
          <span>360</span>
          <div><b>SCIENCE NEWS</b><small>{type === 'admin' ? 'PUSAT KENDALI' : 'RUANG PENULIS'}</small></div>
        </Link>
        <nav className="sidebar-nav" aria-label="Navigasi utama">
          <span className="sidebar-section-label">MENU UTAMA</span>
          {links.map(([label,href,icon]) => {
            const active = pathname === href;
            return <Link className={active ? 'active' : ''} href={href} key={label}><i>{icon}</i><span>{label}</span></Link>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="admin-profile-mini"><span>AD</span><div><b>Administrator</b><small>Sesi aman</small></div></div>
          <Link href="/id">← Kembali ke website</Link>
        </div>
      </aside>
      <main className="dash-main">
        <header className="dashboard-topbar">
          <div><span className="mobile-brand">SN360</span><b>{type === 'admin' ? 'Pusat Kendali Editorial' : 'Ruang Penulis'}</b></div>
          <div className="dashboard-top-actions"><span>{type === 'admin' ? 'Administrator' : 'Penulis'}</span></div>
        </header>
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}
