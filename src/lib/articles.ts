import {homeData, Locale, Story} from './home-data';

export type ArticleRecord = Story & {
  kind: 'news'|'course-material'|'learning-module'|'tutorial'|'learning-video';
  faculty?: string;
  program?: string;
  course?: string;
  level?: string;
  semester?: string;
  topic?: string;
  learningOutcomes?: string[];
  publishedAt?: string;
  updatedAt?: string;
  doi?: string;
  citation?: string;
  videoId?: string;
};

const learningId: ArticleRecord[] = [
  {slug:'keseimbangan-is-lm-perekonomian-tiga-sektor',category:'Ekonomi Makro',title:'Keseimbangan IS–LM pada Perekonomian Tiga Sektor',summary:'Materi terstruktur tentang pembentukan kurva IS, kurva LM, keseimbangan pendapatan, dan tingkat bunga.',author:'Aiyub, S.E., M.Ec., Ph.D.',institution:'Universitas Malikussaleh',time:'14 menit baca',image:'/images/economics.svg',kind:'course-material',faculty:'Ekonomi dan Bisnis',program:'Ekonomi Pembangunan',course:'Ekonomi Makro',level:'Sarjana',semester:'4',topic:'Keseimbangan IS–LM',learningOutcomes:['Menjelaskan pembentukan kurva IS dan LM','Menghitung keseimbangan pendapatan dan tingkat bunga','Menganalisis dampak kebijakan fiskal dan moneter']},
  {slug:'elastisitas-permintaan-dan-penawaran',category:'Ekonomi Mikro',title:'Elastisitas Permintaan dan Penawaran',summary:'Konsep, rumus, interpretasi, dan contoh penerapan elastisitas dalam keputusan ekonomi.',author:'Science News 360 Learning Desk',institution:'Science News 360',time:'11 menit baca',image:'/images/economics.svg',kind:'learning-module',faculty:'Ekonomi dan Bisnis',program:'Ekonomi Pembangunan',course:'Ekonomi Mikro',level:'Sarjana',semester:'2',topic:'Elastisitas'},
  {slug:'analisis-laporan-keuangan-dasar',category:'Akuntansi',title:'Analisis Laporan Keuangan: Rasio dan Interpretasi Dasar',summary:'Panduan membaca likuiditas, solvabilitas, aktivitas, dan profitabilitas perusahaan.',author:'Accounting Learning Desk',institution:'Science News 360',time:'13 menit baca',image:'/images/education.svg',kind:'tutorial',faculty:'Ekonomi dan Bisnis',program:'Akuntansi',course:'Analisis Laporan Keuangan',level:'Sarjana',semester:'5',topic:'Analisis Rasio'},
  {slug:'kepemimpinan-transformasional-organisasi',category:'Manajemen',title:'Kepemimpinan Transformasional dalam Organisasi Modern',summary:'Materi pembelajaran tentang pengaruh ideal, motivasi inspiratif, stimulasi intelektual, dan perhatian individual.',author:'Management Learning Desk',institution:'Science News 360',time:'12 menit baca',image:'/images/education.svg',kind:'course-material',faculty:'Ekonomi dan Bisnis',program:'Manajemen',course:'Kepemimpinan',level:'Sarjana',semester:'5',topic:'Transformational Leadership'},
  {slug:'prinsip-dasar-ekonomi-islam',category:'Ekonomi Islam',title:'Prinsip Dasar Ekonomi Islam dan Fiqh Muamalah',summary:'Pengenalan nilai keadilan, larangan riba, transaksi halal, zakat, sedekah, dan wakaf.',author:'Islamic Economics Desk',institution:'Science News 360',time:'15 menit baca',image:'/images/history.svg',kind:'course-material',faculty:'Ekonomi dan Bisnis',program:'Ekonomi Islam',course:'Pengantar Ekonomi Islam',level:'Sarjana',semester:'1',topic:'Fiqh Muamalah'},
  {slug:'tutorial-smartpls-model-pengukuran',category:'Metodologi Penelitian',title:'Tutorial SmartPLS: Menilai Model Pengukuran',summary:'Video pembelajaran dan langkah praktis menilai outer loading, AVE, reliabilitas, HTMT, dan Fornell–Larcker.',author:'Research Methods Desk',institution:'Science News 360',time:'18 menit',image:'/images/quantum.svg',kind:'learning-video',faculty:'Umum',program:'Lintas Program Studi',course:'Metodologi Penelitian',level:'Sarjana/Magister',semester:'Semua',topic:'PLS-SEM'}
];

const learningEn: ArticleRecord[] = learningId.map((x,i)=>({...x,
 title:[
  'IS–LM Equilibrium in a Three-Sector Economy',
  'Elasticity of Demand and Supply',
  'Financial Statement Analysis: Core Ratios and Interpretation',
  'Transformational Leadership in Modern Organizations',
  'Foundations of Islamic Economics and Fiqh Muamalah',
  'SmartPLS Tutorial: Assessing the Measurement Model'][i],
 summary:[
  'A structured lesson on the IS curve, LM curve, equilibrium income, and the interest rate.',
  'Concepts, formulas, interpretation, and examples of elasticity in economic decisions.',
  'A guide to liquidity, solvency, activity, and profitability ratios.',
  'A learning resource on idealized influence, inspirational motivation, intellectual stimulation, and individualized consideration.',
  'An introduction to justice, the prohibition of riba, halal transactions, zakat, charity, and waqf.',
  'A practical video guide to outer loadings, AVE, reliability, HTMT, and Fornell–Larcker.'
 ][i]
}));

export function getAllArticles(locale:Locale):ArticleRecord[]{
 const d=homeData[locale];
 const news=[d.hero,...d.secondary,...d.latest].map((s,index)=>({...s,kind:'news' as const,publishedAt:locale==='id'?'4 Agustus 2026':'August 4, 2026',updatedAt:locale==='id'?'4 Agustus 2026':'August 4, 2026',doi:`10.3600/sn360.${2026}.${String(index+1).padStart(4,'0')}`,citation:`${s.author} (2026). ${s.title}. Science News 360.`,videoId:index===0?'M7lc1UVf-VE':undefined}));
 const learning=(locale==='id'?learningId:learningEn).map((s,index)=>({...s,publishedAt:locale==='id'?'4 Agustus 2026':'August 4, 2026',updatedAt:locale==='id'?'4 Agustus 2026':'August 4, 2026',doi:`10.3600/sn360.learning.${String(index+1).padStart(4,'0')}`,citation:`${s.author} (2026). ${s.title}. Science News 360 Learning Center.`,videoId:s.kind==='learning-video'?'M7lc1UVf-VE':undefined}));
 return [...news,...learning];
}
const legacyArticleAliases: Record<string,string> = {
  'ai-university-research':'ai-riset-universitas',
  'climate-ocean':'misi-samudra-dalam',
  'quantum-health':'komputasi-kuantum',
  'future-learning':'pendidikan-digital',
  'space-telescope':'misi-samudra-dalam',
  'green-energy':'energi-surya-generasi-baru'
};

export function getArticle(locale:Locale,slug:string){
 const resolvedSlug=legacyArticleAliases[slug]||slug;
 return getAllArticles(locale).find(x=>x.slug===resolvedSlug)
}
export function getLearningMaterials(locale:Locale){return locale==='id'?learningId:learningEn}
