'use client';
import Link from 'next/link';
import {useMemo,useState} from 'react';
import type {ArticleRecord} from '@/lib/articles';

export default function LearningCatalog({locale,materials}:{locale:'id'|'en';materials:ArticleRecord[]}){
 const all=locale==='id'?'Semua':'All';
 const [faculty,setFaculty]=useState(all),[program,setProgram]=useState(all),[course,setCourse]=useState(all),[semester,setSemester]=useState(all),[query,setQuery]=useState('');
 const values=(key:keyof ArticleRecord)=>[all,...Array.from(new Set(materials.map(x=>String(x[key]||'')).filter(Boolean)))];
 const filtered=useMemo(()=>materials.filter(x=>(faculty===all||x.faculty===faculty)&&(program===all||x.program===program)&&(course===all||x.course===course)&&(semester===all||x.semester===semester)&&(!query||`${x.title} ${x.summary} ${x.topic}`.toLowerCase().includes(query.toLowerCase()))),[materials,faculty,program,course,semester,query,all]);
 return <>
  <div className="learning-filters">
   <label><span>{locale==='id'?'Cari materi':'Search materials'}</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={locale==='id'?'IS–LM, akuntansi, kepemimpinan...':'IS–LM, accounting, leadership...'}/></label>
   <label><span>{locale==='id'?'Fakultas':'Faculty'}</span><select value={faculty} onChange={e=>setFaculty(e.target.value)}>{values('faculty').map(x=><option key={x}>{x}</option>)}</select></label>
   <label><span>{locale==='id'?'Program Studi':'Study Program'}</span><select value={program} onChange={e=>setProgram(e.target.value)}>{values('program').map(x=><option key={x}>{x}</option>)}</select></label>
   <label><span>{locale==='id'?'Mata Kuliah':'Course'}</span><select value={course} onChange={e=>setCourse(e.target.value)}>{values('course').map(x=><option key={x}>{x}</option>)}</select></label>
   <label><span>{locale==='id'?'Semester':'Semester'}</span><select value={semester} onChange={e=>setSemester(e.target.value)}>{values('semester').map(x=><option key={x}>{x}</option>)}</select></label>
  </div>
  <div className="catalog-summary"><b>{filtered.length}</b> {locale==='id'?'materi ditemukan':'materials found'}</div>
  <div className="learning-grid">{filtered.map(x=><article className="learning-card" key={x.slug}>
   <Link href={`/${locale}/article/${x.slug}`} className="learning-image"><img src={x.image} alt=""/><span>{x.kind.replaceAll('-',' ')}</span></Link>
   <div><p className="learning-path">{x.program} / {x.course}</p><h3><Link href={`/${locale}/article/${x.slug}`}>{x.title}</Link></h3><p>{x.summary}</p><div className="learning-meta"><span>{x.level}</span><span>{locale==='id'?'Semester':'Semester'} {x.semester}</span><span>{x.time}</span></div></div>
  </article>)}</div>
  {!filtered.length&&<div className="empty-learning"><h3>{locale==='id'?'Materi belum ditemukan':'No material found'}</h3><p>{locale==='id'?'Kurangi filter atau gunakan kata kunci lain.':'Reduce the filters or try another keyword.'}</p></div>}
 </>
}
