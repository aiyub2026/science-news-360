'use client';

import {useEffect,useRef,useState} from 'react';
import {useAuth} from '@/components/auth/AuthProvider';
import {prepareImage} from '@/lib/cms/media';

const PROFILE_KEY='sn360-author-profile';

function profileKey(user?:{id?:string;email?:string}|null){
 const identity=(user?.id||user?.email||'').trim().toLowerCase();
 return identity?`${PROFILE_KEY}:${identity}`:PROFILE_KEY;
}

type Profile={
 name:string;
 institution:string;
 orcid:string;
 googleScholar:string;
 website:string;
 linkedin:string;
 youtube:string;
 bio:string;
 photo:string;
 logo:string;
};

type PhotoEditorState={
 src:string;
 zoom:number;
 x:number;
 y:number;
};

function loadImage(src:string):Promise<HTMLImageElement>{
 return new Promise((resolve,reject)=>{
  const img=new Image();
  img.onload=()=>resolve(img);
  img.onerror=()=>reject(new Error('Foto tidak dapat dibaca.'));
  img.src=src;
 });
}

async function fileToDataUrl(file:File):Promise<string>{
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onload=()=>resolve(String(reader.result||''));
  reader.onerror=()=>reject(new Error('Foto gagal dibaca.'));
  reader.readAsDataURL(file);
 });
}

export default function AuthorProfileMedia(){
 const {user,completeProfile}=useAuth();

 const photoInput=useRef<HTMLInputElement>(null);
 const logoInput=useRef<HTMLInputElement>(null);

 const [p,setP]=useState<Profile>({
  name:'',
  institution:'',
  orcid:'',
  googleScholar:'',
  website:'',
  linkedin:'',
  youtube:'',
  bio:'',
  photo:'',
  logo:''
 });

 const [notice,setNotice]=useState('');
 const [editor,setEditor]=useState<PhotoEditorState|null>(null);
 const [savingPhoto,setSavingPhoto]=useState(false);

 const drag=useRef({
  active:false,
  startX:0,
  startY:0,
  baseX:0,
  baseY:0
 });

 useEffect(()=>{
  try{
   const saved=JSON.parse(localStorage.getItem(profileKey(user))||'{}');
   setP(v=>({
    ...v,
    ...saved,
    name:saved.name||user?.name||'',
    institution:saved.institution||user?.institution||''
   }));
  }catch{}
 },[user]);

 const update=(x:Partial<Profile>)=>setP(v=>({...v,...x}));

 async function choosePhoto(file:File|undefined){
  if(!file)return;

  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){
   setNotice('Gunakan foto JPG, PNG, atau WebP.');
   return;
  }

  try{
   const src=await fileToDataUrl(file);
   await loadImage(src);

   setEditor({
    src,
    zoom:1,
    x:0,
    y:0
   });

   setNotice('');
  }catch(e){
   setNotice(e instanceof Error?e.message:'Foto gagal dibuka.');
  }
 }

 async function uploadLogo(file:File|undefined){
  if(!file)return;

  try{
   const m=await prepareImage(file,'inline');
   update({logo:m.preview});
   setNotice('Logo berhasil diproses. Klik Simpan Profil.');
  }catch(e){
   setNotice(e instanceof Error?e.message:'Logo gagal diproses.');
  }
 }

 function startDrag(clientX:number,clientY:number){
  if(!editor)return;

  drag.current={
   active:true,
   startX:clientX,
   startY:clientY,
   baseX:editor.x,
   baseY:editor.y
  };
 }

 function moveDrag(clientX:number,clientY:number){
  if(!drag.current.active||!editor)return;

  const dx=clientX-drag.current.startX;
  const dy=clientY-drag.current.startY;

  setEditor(v=>v?{
   ...v,
   x:drag.current.baseX+dx,
   y:drag.current.baseY+dy
  }:v);
 }

 function endDrag(){
  drag.current.active=false;
 }

 async function saveEditedPhoto(){
  if(!editor)return;

  try{
   setSavingPhoto(true);

   const img=await loadImage(editor.src);

   const OUTPUT=512;
   const canvas=document.createElement('canvas');
   canvas.width=OUTPUT;
   canvas.height=OUTPUT;

   const ctx=canvas.getContext('2d');

   if(!ctx)throw new Error('Editor foto tidak tersedia.');

   const baseScale=Math.max(
    OUTPUT/img.naturalWidth,
    OUTPUT/img.naturalHeight
   );

   const scale=baseScale*editor.zoom;

   const drawW=img.naturalWidth*scale;
   const drawH=img.naturalHeight*scale;

   const ratio=OUTPUT/320;

   const drawX=(OUTPUT-drawW)/2+(editor.x*ratio);
   const drawY=(OUTPUT-drawH)/2+(editor.y*ratio);

   ctx.drawImage(
    img,
    drawX,
    drawY,
    drawW,
    drawH
   );

   const compressed=canvas.toDataURL('image/webp',0.86);

   update({photo:compressed});
   setEditor(null);

   setNotice(
    'Foto profil berhasil disesuaikan dan dikompresi otomatis. Klik Simpan Profil.'
   );

  }catch(e){
   setNotice(e instanceof Error?e.message:'Foto gagal disimpan.');
  }finally{
   setSavingPhoto(false);
  }
 }

 function save(){
  if(!p.name.trim()){
   setNotice('Nama Penulis wajib diisi.');
   return;
  }

  if(
   p.orcid &&
   !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(p.orcid)
  ){
   setNotice('Format ORCID tidak valid.');
   return;
  }

  localStorage.setItem(profileKey(user),JSON.stringify(p));

  completeProfile({
   name:p.name,
   institution:p.institution
  });

  window.dispatchEvent(
   new CustomEvent('sn360-profile-updated',{detail:p})
  );

  setNotice('Profil profesional berhasil disimpan.');
 }

 return (
  <div>
   <div className="cms-topbar">
    <div>
     <span className="eyebrow">IDENTITAS PENULIS</span>
     <h1 className="serif">Profil Penulis</h1>
     <p>
      Informasi ini akan ditampilkan pada profil, kartu penulis,
      dan artikel.
     </p>
    </div>
   </div>

   {notice&&(
    <div className="cms-notice info">
     <span>i</span>
     <b>{notice}</b>
     <button onClick={()=>setNotice('')}>×</button>
    </div>
   )}

   <div className="profile-media-grid">

    <section>
     <h2>Foto Profil</h2>

     <div className="profile-preview">
      {p.photo
       ? <img src={p.photo} alt={`Foto ${p.name}`}/>
       : <span>{(p.name||'A')[0]}</span>
      }
     </div>

     <input
      ref={photoInput}
      className="sr-file-input"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={e=>{
       void choosePhoto(e.target.files?.[0]);
       e.currentTarget.value='';
      }}
     />

     <div className="profile-file-actions">
      <button
       className="btn btn-primary"
       onClick={()=>photoInput.current?.click()}
      >
       {p.photo?'Ganti Foto':'Unggah Foto'}
      </button>

      {p.photo&&(
       <button
        className="btn"
        onClick={()=>update({photo:''})}
       >
        Hapus
       </button>
      )}
     </div>

     <p>
      Unggah foto JPG, PNG, atau WebP. Foto akan disesuaikan dan
      dikompresi otomatis.
     </p>
    </section>

    <section>
     <h2>Logo Institusi</h2>

     <div className="logo-preview">
      {p.logo
       ? <img src={p.logo} alt="Logo institusi"/>
       : <span>LOGO</span>
      }
     </div>

     <input
      ref={logoInput}
      className="sr-file-input"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={e=>{
       void uploadLogo(e.target.files?.[0]);
       e.currentTarget.value='';
      }}
     />

     <div className="profile-file-actions">
      <button
       className="btn btn-primary"
       onClick={()=>logoInput.current?.click()}
      >
       {p.logo?'Ganti Logo':'Unggah Logo'}
      </button>

      {p.logo&&(
       <button
        className="btn"
        onClick={()=>update({logo:''})}
       >
        Hapus
       </button>
      )}
     </div>
    </section>

    <section className="profile-fields">
     <h2>Informasi Penulis</h2>

     {[
      ['Nama Penulis','name'],
      ['Afiliasi','institution'],
      ['ORCID','orcid'],
      ['Profil Google Scholar','googleScholar'],
      ['Situs Web','website'],
      ['LinkedIn','linkedin'],
      ['YouTube','youtube']
     ].map(([label,key])=>(
      <label key={key}>
       <span>{label}</span>
       <input
        value={String(p[key as keyof Profile]||'')}
        onChange={e=>update({[key]:e.target.value})}
       />
      </label>
     ))}

     <label>
      <span>Biografi</span>
      <textarea
       rows={6}
       value={p.bio}
       onChange={e=>update({bio:e.target.value})}
      />
     </label>

     <button
      className="btn btn-primary profile-save-button"
      onClick={save}
     >
      Simpan Profil
     </button>
    </section>

   </div>

   {editor&&(
    <div
     className="photo-editor-overlay"
     onMouseUp={endDrag}
     onMouseLeave={endDrag}
    >
     <div className="photo-editor-modal">

      <div className="photo-editor-head">
       <div>
        <span className="eyebrow">SESUAIKAN FOTO</span>
        <h2>Atur Foto Profil</h2>
        <p>
         Geser foto sampai wajah berada tepat di tengah lingkaran.
        </p>
       </div>

       <button
        className="photo-editor-close"
        onClick={()=>setEditor(null)}
        aria-label="Tutup"
       >
        ×
       </button>
      </div>

      <div className="photo-editor-workspace">

       <div
        className="photo-crop-frame"
        onMouseDown={e=>{
         e.preventDefault();
         startDrag(e.clientX,e.clientY);
        }}
        onMouseMove={e=>{
         if(drag.current.active){
          e.preventDefault();
          moveDrag(e.clientX,e.clientY);
         }
        }}
        onTouchStart={e=>{
         const t=e.touches[0];
         if(t)startDrag(t.clientX,t.clientY);
        }}
        onTouchMove={e=>{
         const t=e.touches[0];
         if(t)moveDrag(t.clientX,t.clientY);
        }}
        onTouchEnd={endDrag}
       >
        <img
         src={editor.src}
         alt="Pratinjau foto"
         draggable={false}
         style={{
          transform:
           `translate(${editor.x}px, ${editor.y}px) scale(${editor.zoom})`
         }}
        />

        <div className="photo-crop-guide"/>
       </div>

       <div className="photo-editor-controls">

        <label>
         <span>Zoom</span>

         <div className="photo-zoom-row">
          <button
           type="button"
           onClick={()=>setEditor(v=>v?{
            ...v,
            zoom:Math.max(1,v.zoom-0.1)
           }:v)}
          >
           −
          </button>

          <input
           type="range"
           min="1"
           max="3"
           step="0.05"
           value={editor.zoom}
           onChange={e=>setEditor(v=>v?{
            ...v,
            zoom:Number(e.target.value)
           }:v)}
          />

          <button
           type="button"
           onClick={()=>setEditor(v=>v?{
            ...v,
            zoom:Math.min(3,v.zoom+0.1)
           }:v)}
          >
           +
          </button>
         </div>
        </label>

        <p className="photo-editor-help">
         ↕ Geser ke atas atau bawah &nbsp; • &nbsp;
         ↔ Geser ke kiri atau kanan
        </p>

        <button
         type="button"
         className="photo-reset-button"
         onClick={()=>setEditor(v=>v?{
          ...v,
          zoom:1,
          x:0,
          y:0
         }:v)}
        >
         Atur Ulang Posisi
        </button>

       </div>
      </div>

      <div className="photo-editor-actions">
       <button
        type="button"
        className="btn"
        onClick={()=>setEditor(null)}
       >
        Batal
       </button>

       <button
        type="button"
        className="btn btn-primary"
        disabled={savingPhoto}
        onClick={()=>void saveEditedPhoto()}
       >
        {savingPhoto?'Memproses Foto…':'Simpan Foto'}
       </button>
      </div>

     </div>
    </div>
   )}

  </div>
 );
}
