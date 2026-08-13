'use client';

import {useParams} from 'next/navigation';
import {useState} from 'react';
import Link from 'next/link';

export default function VerifyDevice(){
 const params=useParams<{locale:string;token:string}>();
 const [status,setStatus]=useState<'READY'|'BUSY'|'SUCCESS'|'ERROR'>('READY');
 const [message,setMessage]=useState('');

 async function confirm(){
  setStatus('BUSY');
  setMessage('');

  try{
   const r=await fetch('/api/auth/device-verification/confirm',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({token:params.token})
   });

   const d=await r.json();

   if(!r.ok){
    setStatus('ERROR');
    setMessage(d.error||'Verifikasi gagal.');
    return;
   }

   setStatus('SUCCESS');
  }catch{
   setStatus('ERROR');
   setMessage('Tidak dapat menghubungi layanan verifikasi.');
  }
 }

 return (
  <main className="device-verify-page">
   <section className="device-verify-card">
    <div className="device-verify-logo">SN360</div>

    {status==='SUCCESS'?(
     <>
      <div className="device-verify-success">✓</div>
      <span>PERANGKAT TERVERIFIKASI</span>
      <h1>Konfirmasi berhasil.</h1>
      <p>
       Kembali ke perangkat tempat Anda melakukan pendaftaran.
       Halaman registrasi akan melanjutkan secara otomatis.
      </p>
     </>
    ):(
     <>
      <span>SCIENCE NEWS 360</span>
      <h1>Konfirmasi Pendaftaran</h1>
      <p>
       Anda sedang memverifikasi perangkat untuk proses pendaftaran
       Science News 360.
      </p>

      <div className="device-security-box">
       <b>Pastikan Anda sendiri yang memulai pendaftaran ini.</b>
       <small>
        Jangan konfirmasi jika QR Code diberikan oleh orang yang tidak Anda kenal.
       </small>
      </div>

      {message&&<p className="vr-error">{message}</p>}

      <button
       className="vr-primary"
       onClick={confirm}
       disabled={status==='BUSY'}
      >
       {status==='BUSY'?'Memverifikasi…':'Konfirmasi Pendaftaran'}
      </button>
     </>
    )}

    <Link href={`/${params.locale||'id'}`}>← Science News 360</Link>
   </section>
  </main>
 );
}
