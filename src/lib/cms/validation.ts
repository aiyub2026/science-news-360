import {ContentRecord,ContentType} from './types';

export type ValidationIssue={field:string;step:number;message:string};
export type StepValidation={valid:boolean;issues:ValidationIssue[]};
const text=(html:string)=>html.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const words=(value:string)=>value.trim().split(/\s+/).filter(Boolean).length;

export const stepLabels=[
 'Jenis Konten',
 'Informasi Dasar',
 'Isi Artikel',
 'Media & Video',
 'Penulis & Afiliasi',
 'Referensi & Disclosure',
 'Preview & Submit'
];

export function validateContent(r:ContentRecord):ValidationIssue[]{
 const issues:ValidationIssue[]=[];
 if(!r.type)issues.push({field:'type',step:0,message:'Pilih jenis konten.'});
 if(words(r.title)<5)issues.push({field:'title',step:1,message:'Judul minimal 5 kata.'});
 if(r.title.length>140)issues.push({field:'title',step:1,message:'Judul artikel maksimum 140 karakter.'});
 if(words(r.summary)<20)issues.push({field:'summary',step:1,message:'Ringkasan minimal 20 kata.'});
 const academic:ContentType[]=['COURSE_MATERIAL','LEARNING_MODULE','ACADEMIC_TUTORIAL','LEARNING_VIDEO'];
 if(academic.includes(r.type)&&!r.course.trim())issues.push({field:'course',step:1,message:'Mata kuliah wajib diisi untuk konten pembelajaran.'});
 if(words(text(r.bodyHtml))<120)issues.push({field:'bodyHtml',step:2,message:'Isi artikel minimal 120 kata.'});
 if(!r.thumbnail?.preview)issues.push({field:'thumbnail',step:3,message:'Thumbnail artikel wajib diunggah.'});
 if(r.thumbnail&&!r.thumbnail.alt?.trim())issues.push({field:'thumbnailAlt',step:3,message:'Alt text thumbnail wajib diisi.'});
 if(r.inlineMedia.length>3)issues.push({field:'inlineMedia',step:3,message:'Maksimum 3 gambar isi artikel.'});
 r.inlineMedia.forEach((m,i)=>{if(!m.alt?.trim())issues.push({field:`inlineAlt-${i}`,step:3,message:`Alt text gambar ${i+1} wajib diisi.`})});
 if(r.type==='LEARNING_VIDEO'&&r.videoMethod==='NONE')issues.push({field:'videoMethod',step:3,message:'Pilih upload video atau link YouTube.'});
 if(r.videoMethod==='YOUTUBE'&&!r.youtubeId)issues.push({field:'youtubeUrl',step:3,message:'Masukkan link YouTube yang valid.'});
 if(!r.authors[0]?.name?.trim())issues.push({field:'authorName',step:4,message:'Nama penulis utama wajib diisi.'});
 if(!r.authors[0]?.affiliation?.trim())issues.push({field:'affiliation',step:4,message:'Afiliasi penulis utama wajib diisi.'});
 if(r.authors[0]?.orcid&&!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(r.authors[0].orcid))issues.push({field:'orcid',step:4,message:'Format ORCID harus 0000-0000-0000-0000.'});
 if(r.type==='RESEARCH_HIGHLIGHT'&&!r.references.trim())issues.push({field:'references',step:5,message:'Research Highlight wajib mencantumkan referensi utama.'});
 if(!r.conflict.trim())issues.push({field:'conflict',step:5,message:'Pernyataan konflik kepentingan wajib diisi, termasuk jika tidak ada.'});
 return issues;
}

export function validateStep(r:ContentRecord,step:number):StepValidation{
 const issues=validateContent(r).filter(x=>x.step===step);
 return {valid:issues.length===0,issues};
}

export function editorialSeoScore(r:ContentRecord){
 const body=text(r.bodyHtml).toLowerCase();
 const keyword=(r.focusKeyword||'').trim().toLowerCase();
 let score=0;
 const checks:{label:string;ok:boolean;tip:string;points:number}[]=[];
 const add=(label:string,ok:boolean,tip:string,points:number)=>{checks.push({label,ok,tip,points});if(ok)score+=points};
 add('Judul artikel informatif',words(r.title)>=8&&words(r.title)<=20,'Pertahankan judul informatif dan tidak clickbait.',10);
 add('SEO title ≤ 70 karakter',!!r.seoTitle&&r.seoTitle.length<=70,'Buat SEO title ringkas untuk hasil pencarian.',12);
 add('Meta description 120–165 karakter',r.seoDescription.length>=120&&r.seoDescription.length<=165,'Lengkapi meta description editorial.',12);
 add('Focus keyword tersedia',!!keyword,'Tentukan focus keyword editorial.',10);
 add('Keyword ada pada judul',!!keyword&&r.title.toLowerCase().includes(keyword),'Masukkan keyword secara alami bila relevan.',8);
 add('Keyword ada pada paragraf awal',!!keyword&&body.slice(0,500).includes(keyword),'Tambahkan keyword secara alami pada paragraf awal.',8);
 add('Isi artikel ≥ 800 kata',words(body)>=800,'Pertimbangkan pendalaman jika topik membutuhkan konteks lebih luas.',10);
 add('Thumbnail dan alt text',!!r.thumbnail?.preview&&!!r.thumbnail.alt,'Lengkapi thumbnail dan alt text.',10);
 const relatedLinks=[r.relatedMiddleId,r.relatedEndId].filter(Boolean).length;
 add('Minimal 2 internal link',(r.internalLinks||[]).length+relatedLinks>=2,'Tambahkan dua artikel terkait.',8);
 add('Minimal 3 referensi',r.references.split(/\n/).filter(Boolean).length>=3,'Tambahkan sumber kredibel yang relevan.',6);
 add('Slug tersedia',!!r.slug,'Tetapkan slug yang ringkas.',6);
 return {score:Math.min(100,score),checks};
}
