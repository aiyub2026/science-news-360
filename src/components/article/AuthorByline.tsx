'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';

type Profile={name?:string;institution?:string;orcid?:string;photo?:string;logo?:string};
const PROFILE_KEY='sn360-author-profile',PHOTO_KEY='sn360-profile-photo';
export default function AuthorByline({fallbackName,fallbackInstitution,locale,publishedAt,updatedAt,time,doi}:{fallbackName:string;fallbackInstitution:string;locale:string;publishedAt:string;updatedAt:string;time:string;doi:string}){
 const [profile,setProfile]=useState<Profile>({});
 useEffect(()=>{const load=()=>{try{const p=JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}') as Profile;setProfile({...p,photo:p.photo||localStorage.getItem(PHOTO_KEY)||''})}catch{setProfile({photo:localStorage.getItem(PHOTO_KEY)||''})}};load();window.addEventListener('sn360-profile-updated',load);window.addEventListener('storage',load);return()=>{window.removeEventListener('sn360-profile-updated',load);window.removeEventListener('storage',load)}},[]);
 const name=profile.name||fallbackName,institution=profile.institution||fallbackInstitution;
 return <div className="article-author-row professional-byline"><Link className="byline-photo" href={`/${locale}/authors/aiyub`} aria-label={`Profil ${name}`}>{profile.photo?<img src={profile.photo} alt={`Foto ${name}`}/>:<span>{name.charAt(0).toUpperCase()}</span>}</Link><div className="byline-identity"><strong><Link href={`/${locale}/authors/aiyub`}>{name}</Link></strong><span>{institution}</span>{profile.orcid&&<small>ORCID: {profile.orcid}</small>}</div><div className="article-date-meta"><span>{locale==='id'?'Terbit':'Published'}: {publishedAt}</span><span>{locale==='id'?'Diperbarui':'Updated'}: {updatedAt}</span><span>{time}</span><span>DOI: {doi}</span></div></div>
}
