'use client';

import Link from 'next/link';
import {FormEvent,useEffect,useMemo,useState} from 'react';
import {useRouter} from 'next/navigation';
import qrcode from 'qrcode-generator';
import {useAuth} from './AuthProvider';

type Step=1|2|3|4;
type QrStatus='IDLE'|'CREATING'|'PENDING'|'VERIFIED'|'EXPIRED'|'ERROR';

export default function VerifiedRegistration({locale}:{locale:'id'|'en'}){
 const {register}=useAuth();
 const router=useRouter();

 const [step,setStep]=useState<Step>(1);

 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [phone,setPhone]=useState('');
 const [password,setPassword]=useState('');
 const [confirm,setConfirm]=useState('');
 const [agree,setAgree]=useState(false);

 const [institution,setInstitution]=useState('');
 const [position,setPosition]=useState('');
 const [expertise,setExpertise]=useState('');
 const [bio,setBio]=useState('');
 const [country,setCountry]=useState('Indonesia');
 const [orcid,setOrcid]=useState('');

 const [qrToken,setQrToken]=useState('');
 const [qrUrl,setQrUrl]=useState('');
 const [qrStatus,setQrStatus]=useState<QrStatus>('IDLE');
 const [expiresAt,setExpiresAt]=useState('');
 const [secondsLeft,setSecondsLeft]=useState(0);

 const [notice,setNotice]=useState('');
 const [busy,setBusy]=useState(false);

 async function createQrChallenge(){
  setNotice('');
  setQrStatus('CREATING');

  try{
   const r=await fetch('/api/auth/device-verification/create',{
    method:'POST'
   });

   const d=await r.json();

   if(!r.ok||!d.token){
    setQrStatus('ERROR');
    setNotice(d.error||'Tidak dapat membuat QR verifikasi.');
    return;
   }

   const origin=window.location.origin;

   if(
    location.hostname==='localhost' ||
    location.hostname==='127.0.0.1'
   ){
    setQrStatus('ERROR');
    setNotice(
     'Untuk scan QR dari HP, buka halaman registrasi melalui IP Mac, misalnya http://10.15.4.9:3000/id/register'
    );
    return;
   }

   const url=`${origin}/${locale}/verify-device/${d.token}`;

   setQrToken(d.token);
   setQrUrl(url);
   setExpiresAt(d.expiresAt);
   setQrStatus('PENDING');
  }catch{
   setQrStatus('ERROR');
   setNotice('Tidak dapat menghubungi layanan verifikasi perangkat.');
  }
 }

 function startVerification(e:FormEvent){
  e.preventDefault();
  setNotice('');

  if(!name.trim()||!email.trim()||!phone.trim()||!password){
   setNotice('Lengkapi seluruh data wajib.');
   return;
  }

  if(password.length<10){
   setNotice('Kata sandi minimal 10 karakter.');
   return;
  }

  if(password!==confirm){
   setNotice('Konfirmasi kata sandi tidak sama.');
   return;
  }

  if(!agree){
   setNotice('Anda harus menyetujui Syarat & Ketentuan dan Kebijakan Privasi.');
   return;
  }

  setStep(2);
  void createQrChallenge();
 }

 useEffect(()=>{
  if(!qrToken||qrStatus!=='PENDING')return;

  let stopped=false;

  async function check(){
   try{
    const r=await fetch(
     `/api/auth/device-verification/status?token=${encodeURIComponent(qrToken)}`,
     {cache:'no-store'}
    );

    const d=await r.json();

    if(stopped)return;

    if(d.status==='VERIFIED'){
     setQrStatus('VERIFIED');

     window.setTimeout(()=>{
      if(!stopped)setStep(3);
     },900);

     return;
    }

    if(d.status==='EXPIRED'){
     setQrStatus('EXPIRED');
    }
   }catch{}
  }

  void check();

  const timer=window.setInterval(()=>{
   void check();
  },2000);

  return()=>{
   stopped=true;
   window.clearInterval(timer);
  };
 },[qrToken,qrStatus]);

 useEffect(()=>{
  if(!expiresAt||qrStatus!=='PENDING')return;

  function tick(){
   const left=Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime()-Date.now())/1000)
   );

   setSecondsLeft(left);

   if(left<=0){
    setQrStatus('EXPIRED');
   }
  }

  tick();

  const timer=window.setInterval(tick,1000);

  return()=>window.clearInterval(timer);
 },[expiresAt,qrStatus]);

 const qrImage=useMemo(()=>{
  if(!qrUrl)return '';

  try{
   const qr=qrcode(0,'M');
   qr.addData(qrUrl);
   qr.make();

   return qr.createDataURL(7,12);
  }catch{
   return '';
  }
 },[qrUrl]);

 const countdown=useMemo(()=>{
  const m=Math.floor(secondsLeft/60);
  const s=secondsLeft%60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
 },[secondsLeft]);

 async function completeRegistration(e:FormEvent){
  e.preventDefault();
  setNotice('');

  if(qrStatus!=='VERIFIED'){
   setNotice('Perangkat belum diverifikasi.');
   return;
  }

  if(!institution.trim()||!position.trim()||!expertise.trim()){
   setNotice('Lengkapi institusi, jabatan/profesi, dan bidang keahlian.');
   return;
  }

  setBusy(true);

  const result=await register(
   name,
   email,
   password,
   institution
  );

  setBusy(false);

  if(!result.ok){
   setNotice(result.error||'Registrasi gagal.');
   return;
  }

  setStep(4);
 }

 return (
  <div className="verified-registration">

   <aside className="vr-brand">
    <div className="vr-brand-logo">
     <span className="vr-orbit">360</span>
     <div>
      <strong>SCIENCE NEWS <em>360</em></strong>
      <small>GLOBAL KNOWLEDGE NETWORK</small>
     </div>
    </div>

    <div className="vr-brand-copy">
     <h1>Bergabung sebagai <span>Penulis</span></h1>
     <p>
      Bergabunglah dengan komunitas penulis dan bagikan ide,
      riset, serta pengetahuan Anda kepada dunia melalui Science News 360.
     </p>
    </div>

    <div className="vr-benefits">
     <article>
      <i>✓</i>
      <div>
       <b>Akun Aman & Terverifikasi</b>
       <p>Verifikasi perangkat membantu mencegah pendaftaran otomatis dan akun palsu.</p>
      </div>
     </article>

     <article>
      <i>✎</i>
      <div>
       <b>Publikasikan Karya Anda</b>
       <p>Bagikan ide, riset, dan pengetahuan kepada komunitas global.</p>
      </div>
     </article>

     <article>
      <i>◎</i>
      <div>
       <b>Bangun Reputasi Akademik</b>
       <p>Tingkatkan profil dan jangkauan karya ilmiah Anda.</p>
      </div>
     </article>
    </div>

    <blockquote>
     “Science is a collaborative journey,<br/>
     let&apos;s build the future together.”
    </blockquote>

    <div className="vr-science-art">
     <span>⚗</span><span>⚗</span><span>⚗</span><span>⌕</span>
    </div>
   </aside>

   <section className="vr-panel">

    <div className="vr-steps">
     {[
      [1,'Akun'],
      [2,'Verifikasi'],
      [3,'Profil'],
      [4,'Selesai']
     ].map(([n,label],i)=>(
      <div
       className={`vr-step ${step>=Number(n)?'active':''}`}
       key={String(label)}
      >
       <div className="vr-step-line">
        <b>{n}</b>
        {i<3&&<span/>}
       </div>
       <small>{label}</small>
      </div>
     ))}
    </div>

    {step===1&&(
     <form className="vr-form" onSubmit={startVerification}>
      <header>
       <h2>Buat Akun Baru</h2>
       <p>
        Lengkapi data berikut untuk membuat akun penulis
        di Science News 360.
       </p>
      </header>

      <div className="vr-grid">
       <label>
        <b>Nama Lengkap</b>
        <input
         value={name}
         onChange={e=>setName(e.target.value)}
         placeholder="Contoh: Aiyub, S.E., M.Ec., Ph.D."
         required
        />
       </label>

       <label>
        <b>Email Aktif</b>
        <input
         type="email"
         value={email}
         onChange={e=>setEmail(e.target.value)}
         placeholder="contoh@email.com"
         autoComplete="email"
         required
        />
       </label>
      </div>

      <label>
       <b>Nomor WhatsApp Aktif</b>
       <div className="vr-phone">
        <span>🇮🇩 +62</span>
        <input
         value={phone}
         onChange={e=>setPhone(e.target.value.replace(/[^\d ]/g,''))}
         placeholder="812 3456 7890"
         inputMode="tel"
         required
        />
       </div>
       <small>
        Nomor WhatsApp disimpan sebagai kontak penulis.
        Verifikasi WhatsApp akan tersedia pada tahap berikutnya.
       </small>
      </label>

      <div className="vr-grid">
       <label>
        <b>Kata Sandi</b>
        <input
         type="password"
         value={password}
         onChange={e=>setPassword(e.target.value)}
         minLength={10}
         autoComplete="new-password"
         required
        />
        <small>Minimal 10 karakter.</small>
       </label>

       <label>
        <b>Konfirmasi Kata Sandi</b>
        <input
         type="password"
         value={confirm}
         onChange={e=>setConfirm(e.target.value)}
         minLength={10}
         required
        />
       </label>
      </div>

      <label className="vr-consent">
       <input
        type="checkbox"
        checked={agree}
        onChange={e=>setAgree(e.target.checked)}
       />
       <span>
        Saya menyetujui <a>Syarat & Ketentuan</a> dan
        <a> Kebijakan Privasi</a> Science News 360.
       </span>
      </label>

      <div className="vr-security">
       <i>▣</i>
       <div>
        <b>Verifikasi Perangkat dengan QR Code</b>
        <p>
         Setelah melanjutkan, scan QR Code menggunakan HP Anda
         untuk mengonfirmasi proses pendaftaran.
        </p>
       </div>
      </div>

      {notice&&<p className="vr-error">{notice}</p>}

      <button className="vr-primary" type="submit">
       Lanjutkan Verifikasi →
      </button>

      <p className="vr-login">
       Sudah punya akun? <Link href={`/${locale}/login`}>Masuk di sini</Link>
      </p>
     </form>
    )}

    {step===2&&(
     <div className="vr-form vr-qr-verification">
      <header>
       <h2>Verifikasi Perangkat Anda</h2>
       <p>
        Scan QR Code menggunakan kamera HP.
        Kemudian tekan <b>Konfirmasi Pendaftaran</b> pada halaman
        Science News 360 yang terbuka.
       </p>
      </header>

      <div className="vr-qr-layout">

       <div className={`vr-qr-card ${qrStatus.toLowerCase()}`}>
        {qrStatus==='CREATING'&&(
         <div className="vr-qr-loading">
          <i/>
          <b>Membuat QR Code…</b>
         </div>
        )}

        {qrImage&&qrStatus==='PENDING'&&(
         <>
          <img
           src={qrImage}
           alt="QR Code verifikasi perangkat Science News 360"
          />
          <span>SCAN DENGAN HP</span>
          <small>Berlaku selama {countdown}</small>
         </>
        )}

        {qrStatus==='VERIFIED'&&(
         <div className="vr-qr-success">
          <i>✓</i>
          <b>Perangkat berhasil diverifikasi</b>
          <p>Verifikasi selesai. Silakan lanjutkan untuk melengkapi profil.</p>
          <button
           className="vr-primary vr-qr-continue"
           type="button"
           onClick={()=>setStep(3)}
          >
           Lanjutkan ke Profil →
          </button>
         </div>
        )}

        {qrStatus==='EXPIRED'&&(
         <div className="vr-qr-expired">
          <i>!</i>
          <b>QR Code kedaluwarsa</b>
          <p>Buat QR Code baru untuk melanjutkan.</p>
         </div>
        )}
       </div>

       <div className="vr-qr-instructions">
        <span>LANGKAH VERIFIKASI</span>

        <ol>
         <li>
          <b>1</b>
          <div>
           <strong>Buka kamera HP</strong>
           <small>Arahkan kamera ke QR Code.</small>
          </div>
         </li>

         <li>
          <b>2</b>
          <div>
           <strong>Buka tautan Science News 360</strong>
           <small>Browser HP akan membuka halaman verifikasi.</small>
          </div>
         </li>

         <li>
          <b>3</b>
          <div>
           <strong>Konfirmasi Pendaftaran</strong>
           <small>Tekan tombol konfirmasi pada HP.</small>
          </div>
         </li>

         <li>
          <b>4</b>
          <div>
           <strong>Kembali ke perangkat ini</strong>
           <small>Halaman akan melanjutkan secara otomatis.</small>
          </div>
         </li>
        </ol>

        <div className="vr-qr-security-note">
         <b>QR Code bersifat sekali pakai.</b>
         <small>
          Jangan bagikan QR Code kepada orang lain.
         </small>
        </div>
       </div>
      </div>

      {notice&&<p className="vr-error">{notice}</p>}

      {(qrStatus==='EXPIRED'||qrStatus==='ERROR')&&(
       <button
        className="vr-primary"
        type="button"
        onClick={()=>void createQrChallenge()}
       >
        Buat QR Code Baru
       </button>
      )}

      <button
       className="vr-secondary"
       type="button"
       onClick={()=>{
        setStep(1);
        setQrToken('');
        setQrUrl('');
        setQrStatus('IDLE');
       }}
      >
       ← Kembali ke Data Akun
      </button>
     </div>
    )}

    {step===3&&(
     <form className="vr-form" onSubmit={completeRegistration}>
      <header>
       <h2>Lengkapi Profil Penulis</h2>
       <p>
        Perangkat berhasil diverifikasi.
        Lengkapi profil sebelum membuka Author Workspace.
       </p>
      </header>

      <div className="vr-profile-verified">
       <i>✓</i>
       <div>
        <b>Perangkat Terverifikasi</b>
        <small>Pendaftaran dikonfirmasi melalui perangkat kedua.</small>
       </div>
      </div>

      <div className="vr-profile-avatar">
       <div>{name.slice(0,1).toUpperCase()||'A'}</div>
       <span>
        <b>{name}</b>
        <small>{email}</small>
       </span>
      </div>

      <div className="vr-grid">
       <label>
        <b>Institusi / Afiliasi</b>
        <input
         value={institution}
         onChange={e=>setInstitution(e.target.value)}
         required
        />
       </label>

       <label>
        <b>Jabatan / Profesi</b>
        <input
         value={position}
         onChange={e=>setPosition(e.target.value)}
         placeholder="Dosen, Peneliti, Praktisi..."
         required
        />
       </label>

       <label>
        <b>Bidang Keahlian</b>
        <input
         value={expertise}
         onChange={e=>setExpertise(e.target.value)}
         required
        />
       </label>

       <label>
        <b>Negara</b>
        <input
         value={country}
         onChange={e=>setCountry(e.target.value)}
        />
       </label>
      </div>

      <label>
       <b>Bio Singkat</b>
       <textarea
        value={bio}
        onChange={e=>setBio(e.target.value)}
        rows={4}
       />
      </label>

      <label>
       <b>ORCID / Website Profesional <span>(opsional)</span></b>
       <input
        value={orcid}
        onChange={e=>setOrcid(e.target.value)}
       />
      </label>

      {notice&&<p className="vr-error">{notice}</p>}

      <button
       className="vr-primary"
       disabled={busy}
       type="submit"
      >
       {busy?'Menyimpan…':'Simpan Profil & Aktifkan Akun'}
      </button>
     </form>
    )}

    {step===4&&(
     <div className="vr-complete">
      <div className="vr-success-icon">✓</div>
      <span>REGISTRASI BERHASIL</span>

      <h2>Akun penulis Anda telah dibuat.</h2>

      <p>
       Verifikasi perangkat dan profil telah selesai.
       Silakan masuk menggunakan email dan kata sandi yang baru Anda daftarkan
       untuk mengakses Author Workspace Science News 360.
      </p>

      <button
       className="vr-primary"
       onClick={()=>router.push(`/${locale}/login`)}
      >
       Masuk ke Akun →
      </button>

      <button
       className="vr-secondary"
       type="button"
       onClick={()=>router.push(`/${locale}`)}
      >
       Kembali ke Beranda
      </button>
     </div>
    )}

   </section>
  </div>
 );
}
