'use client';

import {useEffect, useState} from 'react';

type Props={title:string; locale:'id'|'en'; canonicalUrl?:string};

function safePublicUrl(candidate?:string){
 try{const u=new URL(candidate||window.location.href);if(['localhost','127.0.0.1','0.0.0.0'].includes(u.hostname)){const base=process.env.NEXT_PUBLIC_SITE_URL||'https://sciencenews360.com';return new URL(window.location.pathname,base).toString()}u.hash='';u.search='';return u.toString()}catch{return 'https://sciencenews360.com'}
}

export default function ArticleActions({title,locale,canonicalUrl}:Props){
 const [saved,setSaved]=useState(false);const [copied,setCopied]=useState(false);const [url,setUrl]=useState('');
 useEffect(()=>{setUrl(safePublicUrl(canonicalUrl));setSaved(localStorage.getItem(`sn360-bookmark:${window.location.pathname}`)==='1')},[canonicalUrl]);
 const toggle=()=>{const next=!saved;setSaved(next);localStorage.setItem(`sn360-bookmark:${window.location.pathname}`,next?'1':'0')};
 const share=(network:string)=>{const publicUrl=safePublicUrl(url||canonicalUrl),u=encodeURIComponent(publicUrl),t=encodeURIComponent(title);const links:Record<string,string>={whatsapp:`https://wa.me/?text=${t}%20${u}`,x:`https://x.com/intent/post?text=${t}&url=${u}`,facebook:`https://www.facebook.com/sharer/sharer.php?u=${u}`,linkedin:`https://www.linkedin.com/sharing/share-offsite/?url=${u}`};window.open(links[network],'_blank','noopener,noreferrer,width=760,height=620')};
 const copy=async()=>{await navigator.clipboard.writeText(safePublicUrl(url||canonicalUrl));setCopied(true);setTimeout(()=>setCopied(false),1500)};
 return <div className="article-action-panel" aria-label={locale==='id'?'Alat artikel':'Article tools'}>
  <button onClick={()=>share('whatsapp')} aria-label="Bagikan ke WhatsApp">WA</button><button onClick={()=>share('x')} aria-label="Bagikan ke X">X</button><button onClick={()=>share('facebook')} aria-label="Bagikan ke Facebook">f</button><button onClick={()=>share('linkedin')} aria-label="Bagikan ke LinkedIn">in</button><button onClick={toggle} className={saved?'is-active':''} aria-pressed={saved}>{saved?'★':'☆'}</button><button onClick={copy}>{copied?'✓':'⧉'}</button><button onClick={()=>window.print()} aria-label={locale==='id'?'Cetak atau simpan PDF':'Print or save PDF'}>PDF</button>
 </div>
}
