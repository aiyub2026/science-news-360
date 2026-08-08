'use client';

import Link from 'next/link';
import {FormEvent,useState} from 'react';

export default function AdminRegister(){
  const [name,setName]=useState('');
  const [institution,setInstitution]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [secret,setSecret]=useState('');
  const [notice,setNotice]=useState('');
  const [success,setSuccess]=useState(false);

  async function submit(e:FormEvent){
    e.preventDefault();

    if(password!==confirm){
      setNotice('Konfirmasi kata sandi tidak sama.');
      return;
    }

    setNotice('Memproses registrasi Administrator...');

    try{
      const r=await fetch('/api/auth/admin-register',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,institution,email,password,secret})
      });

      const d=await r.json();

      if(!r.ok){
        setNotice(d.error||'Registrasi Administrator gagal.');
        return;
      }

      setSuccess(true);
      setNotice('Administrator berhasil diaktifkan.');
    }catch{
      setNotice('Tidak dapat menghubungi layanan registrasi Administrator.');
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">AKSES PRIVAT</span>
        <h1>Daftar Administrator</h1>
        <p>
          Halaman ini hanya untuk pengelola Science News 360 yang memiliki
          kode registrasi Administrator.
        </p>

        {success ? (
          <div>
            <p className="auth-success">{notice}</p>
            <Link className="btn btn-primary" href="/admin/login">
              Masuk sebagai Administrator
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label>
              Nama lengkap
              <input value={name} onChange={e=>setName(e.target.value)} required/>
            </label>

            <label>
              Institusi
              <input value={institution} onChange={e=>setInstitution(e.target.value)}/>
            </label>

            <label>
              Email
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
            </label>

            <label>
              Kata sandi
              <input
                type="password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                minLength={12}
                required
              />
            </label>

            <label>
              Konfirmasi kata sandi
              <input
                type="password"
                value={confirm}
                onChange={e=>setConfirm(e.target.value)}
                minLength={12}
                required
              />
            </label>

            <label>
              Kode registrasi Administrator
              <input
                type="password"
                value={secret}
                onChange={e=>setSecret(e.target.value)}
                required
              />
            </label>

            {notice && <p>{notice}</p>}

            <button className="btn btn-primary" type="submit">
              Daftarkan Administrator
            </button>
          </form>
        )}

        <p>
          <Link href="/admin/login">← Kembali ke Masuk Admin</Link>
        </p>
      </section>
    </main>
  );
}
