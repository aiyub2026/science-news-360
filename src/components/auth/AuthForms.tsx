'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from './AuthProvider';

export function LoginForm({ locale, adminOnly = false }: { locale: 'id' | 'en'; adminOnly?: boolean }) {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await login(email, password, adminOnly ? 'ADMINISTRATOR' : undefined);
    if (!result.ok) {
      setError(result.error || (locale === 'id' ? 'Login gagal.' : 'Sign-in failed.'));
      return;
    }
    router.push(searchParams.get('next') || result.redirect || '/dashboard/author');
  }

  return (
    <form className="auth-form auth-form-compact" onSubmit={submit}>
      <div className="auth-field">
        <label htmlFor={adminOnly ? 'admin-email' : 'login-email'}>Email</label>
        <input
          id={adminOnly ? 'admin-email' : 'login-email'}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          placeholder="nama@institusi.ac.id"
          required
        />
      </div>
      <div className="auth-field">
        <div className="auth-label-row">
          <label htmlFor={adminOnly ? 'admin-password' : 'login-password'}>{locale === 'id' ? 'Kata sandi' : 'Password'}</label>
          {!adminOnly && <Link href={`/${locale}/forgot-password`}>{locale === 'id' ? 'Lupa kata sandi?' : 'Forgot password?'}</Link>}
        </div>
        <input
          id={adminOnly ? 'admin-password' : 'login-password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-primary auth-submit" type="submit">
        {adminOnly ? 'Masuk ke Admin' : locale === 'id' ? 'Masuk' : 'Sign in'}
      </button>
      {!adminOnly && (
        <div className="author-signup-prompt">
          <span>{locale === 'id' ? 'Belum memiliki akun penulis?' : 'Do not have an author account?'}</span>
          <Link href={`/${locale}/register`}>{locale === 'id' ? 'Daftar sebagai Penulis' : 'Register as an Author'}</Link>
        </div>
      )}
      <p className="auth-security-note">
        {adminOnly
          ? 'Akses terbatas untuk Administrator dan pengelola sistem.'
          : locale === 'id'
            ? 'Pembaca tidak perlu mendaftar. Akun hanya diperlukan untuk mengirim dan mengelola artikel.'
            : 'Readers do not need an account. Registration is only required to submit and manage content.'}
      </p>
    </form>
  );
}

export function RegisterForm({ locale }: { locale: 'id' | 'en' }) {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await register(name, email, password, institution);
    if (!result.ok) {
      setError(result.error || (locale === 'id' ? 'Lengkapi data dan gunakan kata sandi minimal 10 karakter.' : 'Complete all fields and use at least 10 characters.'));
      return;
    }
    router.push(`/${locale}/contributor-application`);
  }

  return (
    <form className="auth-form author-register-form" onSubmit={submit}>
      <div className="auth-field-grid">
        <div className="auth-field"><label htmlFor="register-name">{locale === 'id' ? 'Nama lengkap' : 'Full name'}</label><input id="register-name" value={name} onChange={(event) => setName(event.target.value)} required /></div>
        <div className="auth-field"><label htmlFor="register-institution">{locale === 'id' ? 'Institusi/Afiliasi' : 'Institution/Affiliation'}</label><input id="register-institution" value={institution} onChange={(event) => setInstitution(event.target.value)} placeholder="Universitas atau lembaga" required /></div>
      </div>
      <div className="auth-field"><label htmlFor="register-email">Email</label><input id="register-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required /></div>
      <div className="auth-field"><label htmlFor="register-password">{locale === 'id' ? 'Kata sandi' : 'Password'}</label><input id="register-password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={10} autoComplete="new-password" required /></div>
      {error && <p className="form-error">{error}</p>}
      <label className="auth-consent"><input type="checkbox" required /><span>{locale === 'id' ? 'Saya menyetujui kebijakan editorial, ketentuan penulis, dan pemeriksaan artikel sebelum publikasi.' : 'I agree to the editorial policy, author terms, and pre-publication review.'}</span></label>
      <button className="btn btn-primary auth-submit" type="submit">{locale === 'id' ? 'Buat Akun Penulis' : 'Create Author Account'}</button>
      <p className="auth-security-note">{locale === 'id' ? 'Pendaftaran akan ditinjau Administrator. Setelah disetujui, akun Penulis dapat membuat draft dan mengirim artikel untuk review editorial.' : 'Registration is reviewed by an Administrator. Once approved, Authors can create drafts and submit them for editorial review.'}</p>
      <div className="author-signup-prompt"><span>{locale === 'id' ? 'Sudah memiliki akun?' : 'Already have an account?'}</span><Link href={`/${locale}/login`}>{locale === 'id' ? 'Masuk' : 'Sign in'}</Link></div>
    </form>
  );
}
