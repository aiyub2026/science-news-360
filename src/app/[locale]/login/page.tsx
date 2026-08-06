import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/AuthForms';

export default async function Login({ params }: { params: Promise<{ locale: 'id' | 'en' }> }) {
  const { locale } = await params;
  return (
    <main className="auth-shell auth-shell-refined">
      <section className="auth-card enterprise-auth auth-card-refined">
        <div className="auth-brand-mark"><span>360</span><div><b>SCIENCE NEWS</b><small>AUTHOR PORTAL</small></div></div>
        <span className="eyebrow">{locale === 'id' ? 'PORTAL KONTRIBUTOR' : 'CONTRIBUTOR PORTAL'}</span>
        <h1 className="serif">{locale === 'id' ? 'Masuk untuk mengelola karya Anda' : 'Sign in to manage your work'}</h1>
        <p className="summary">{locale === 'id' ? 'Buat draft, unggah media, kirim artikel untuk ditinjau, dan pantau proses editorial dalam satu ruang kerja.' : 'Create drafts, upload media, submit work for review, and track the editorial process in one workspace.'}</p>
        <Suspense fallback={<div className="auth-form">Memuat formulir…</div>}><LoginForm locale={locale} /></Suspense>
        <div className="admin-entry-refined"><span>{locale === 'id' ? 'Bagian editorial atau administrator?' : 'Editorial staff or administrator?'}</span><Link href="/admin/login">{locale === 'id' ? 'Akses Admin' : 'Admin access'}</Link></div>
      </section>
      <aside className="auth-side-panel">
        <span className="eyebrow">SCIENCE NEWS 360</span>
        <h2>{locale === 'id' ? 'Terbuka untuk penulis, tetap dikendalikan editor.' : 'Open to authors, governed by editors.'}</h2>
        <ul><li>{locale === 'id' ? 'Pembaca dapat mengakses berita tanpa akun.' : 'Readers browse freely without an account.'}</li><li>{locale === 'id' ? 'Penulis mendaftar untuk mengirim artikel.' : 'Authors register to submit content.'}</li><li>{locale === 'id' ? 'Setiap artikel melewati review editorial.' : 'Every submission goes through editorial review.'}</li><li>{locale === 'id' ? 'Hanya Publisher/Admin yang dapat menerbitkan.' : 'Only publishers/admins can publish.'}</li></ul>
      </aside>
    </main>
  );
}
