'use client';

import Link from 'next/link';

function slugifyAuthor(value:string){
 return value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9]+/g,'-')
  .replace(/(^-|-$)/g,'');
}

export default function AuthorByline({
 fallbackName,
 fallbackInstitution,
 fallbackPhoto,
 locale,
 publishedAt,
 updatedAt,
 time,
 doi
}:{
 fallbackName:string;
 fallbackInstitution:string;
 fallbackPhoto?:string;
 locale:string;
 publishedAt:string;
 updatedAt:string;
 time:string;
 doi:string;
}){
 const name=fallbackName||'Science News 360';
 const institution=fallbackInstitution||'Science News 360';
 const photo=fallbackPhoto||'';
 const authorSlug=slugifyAuthor(name);

 return (
  <div className="article-author-row professional-byline">
   <Link
    className="byline-photo"
    href={`/${locale}/authors/${authorSlug}`}
    aria-label={`Profil ${name}`}
   >
    {photo
     ? <img src={photo} alt={`Foto ${name}`}/>
     : <span>{name.charAt(0).toUpperCase()}</span>
    }
   </Link>

   <div className="byline-identity">
    <strong>
     <Link href={`/${locale}/authors/${authorSlug}`}>
      {name}
     </Link>
    </strong>

    <span>{institution}</span>
   </div>

   <div className="article-date-meta">
    <span>{locale==='id'?'Terbit':'Published'}: {publishedAt}</span>
    <span>{locale==='id'?'Diperbarui':'Updated'}: {updatedAt}</span>
    <span>{time}</span>
    <span>DOI: {doi}</span>
   </div>
  </div>
 );
}
