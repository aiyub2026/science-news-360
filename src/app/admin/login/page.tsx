import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/AuthForms';

function AdminLoginContent() {
  return (
    <main className="admin-login-page">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-main">
          <Link href="/id" className="admin-login-brand" aria-label="Kembali ke Science News 360">
            <img src="/brand/science-news-360-logo.svg" alt="Science News 360"/>
          </Link>

          <div className="admin-login-heading">
            <span className="admin-security-badge">RESTRICTED ACCESS</span>
            <h1 id="admin-login-title">Masuk ke Admin</h1>
            <p>Kelola editorial, pengguna, publikasi, analitik, dan keamanan melalui satu pusat kendali.</p>
          </div>

          <LoginForm locale="id" adminOnly />

          <div className="admin-login-footer">
            <Link href="/id">← Kembali ke website</Link>
            <span>Aktivitas login dicatat dalam audit keamanan.</span>
          </div>
        </div>

        <aside className="admin-login-aside" aria-label="Informasi keamanan admin">
          <div className="admin-login-aside-top">
            <span className="admin-command-mark">SN360</span>
            <span className="admin-secure-status"><i /> Akses terlindungi</span>
          </div>
          <div className="admin-login-aside-content">
            <span className="eyebrow-light">PUSAT KENDALI EDITORIAL</span>
            <h2>Kendali editorial yang aman dan terpusat.</h2>
            <ul>
              <li><b>01</b><span><strong>Hak akses berdasarkan peran</strong><small>Akses disesuaikan dengan kewenangan Administrator dan System Administrator.</small></span></li>
              <li><b>02</b><span><strong>Audit setiap tindakan</strong><small>Login, perubahan konten, dan keputusan publikasi dapat ditelusuri.</small></span></li>
              <li><b>03</b><span><strong>Publikasi terkontrol</strong><small>Konten hanya dapat diterbitkan melalui workflow dan otorisasi yang sah.</small></span></li>
            </ul>
          </div>
          <p className="admin-login-aside-note">Science News 360 · Administrasi Science News 360</p>
        </aside>
      </section>
    </main>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<main className="admin-login-page"><div className="admin-login-loading">Memuat akses admin…</div></main>}>
      <AdminLoginContent />
    </Suspense>
  );
}
