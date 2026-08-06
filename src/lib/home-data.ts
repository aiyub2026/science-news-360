export type Locale = 'id' | 'en';
export const locales = ['id','en'] as const;
export type Story = {slug:string;category:string;title:string;summary:string;author:string;institution:string;time:string;image:string;accent?:string};

const id = {
  hero: {slug:'ai-riset-universitas',category:'Artificial Intelligence',title:'Kecerdasan Buatan Mengubah Cara Universitas Menemukan Pengetahuan Baru',summary:'Dari laboratorium virtual hingga analisis data berskala besar, AI mempercepat penelitian tanpa menggantikan ketelitian ilmiah manusia.',author:'Aiyub, S.E., M.Ec., Ph.D.',institution:'Universitas Malikussaleh',time:'8 menit baca',image:'/images/hero-ai.svg'},
  secondary:[
    {slug:'energi-surya-generasi-baru',category:'Energy',title:'Panel surya generasi baru menembus batas efisiensi',summary:'Material tandem membuka peluang listrik bersih yang lebih murah.',author:'Science Desk',institution:'SN360 Research',time:'5 menit',image:'/images/solar.svg'},
    {slug:'misi-samudra-dalam',category:'Earth Science',title:'Misi samudra dalam menemukan ekosistem langka',summary:'Robot bawah laut memetakan kehidupan di zona tanpa cahaya.',author:'Nadia Rahman',institution:'Ocean Lab',time:'6 menit',image:'/images/ocean.svg'},
    {slug:'pendidikan-digital',category:'Education',title:'Ruang kelas global memasuki era pembelajaran adaptif',summary:'Teknologi personalisasi membantu dosen memahami kebutuhan mahasiswa.',author:'Education Desk',institution:'Science News 360',time:'7 menit',image:'/images/education.svg'},
    {slug:'kesehatan-presisi',category:'Health',title:'Kesehatan presisi bergerak dari riset menuju layanan publik',summary:'Data genomik mulai dipakai untuk terapi yang lebih tepat.',author:'Medical Review',institution:'Health Network',time:'9 menit',image:'/images/health.svg'}
  ],
  latest:[
    {slug:'komputasi-kuantum',category:'Technology',title:'Komputasi kuantum mendekati penggunaan industri pertama',summary:'Perusahaan dan universitas menguji mesin kuantum untuk logistik dan kimia.',author:'Rafi Akbar',institution:'Tech Desk',time:'6 menit',image:'/images/quantum.svg'},
    {slug:'iklim-kota',category:'Climate',title:'Kota tropis merancang perlindungan baru dari panas ekstrem',summary:'Ruang hijau, atap reflektif, dan data satelit menjadi satu sistem adaptasi.',author:'Maya Putri',institution:'Climate Desk',time:'7 menit',image:'/images/climate.svg'},
    {slug:'mikrobioma',category:'Biology',title:'Mikrobioma manusia memberi petunjuk baru tentang imunitas',summary:'Peneliti menghubungkan keragaman mikroba dengan respons tubuh.',author:'Dimas Pratama',institution:'Life Science',time:'5 menit',image:'/images/biology.svg'},
    {slug:'ekonomi-digital',category:'Economics',title:'Ekonomi digital mengubah peta produktivitas regional',summary:'Infrastruktur, keterampilan, dan tata kelola menentukan besarnya manfaat.',author:'Economic Research',institution:'SN360',time:'8 menit',image:'/images/economics.svg'},
    {slug:'arkeologi-ai',category:'History',title:'AI membantu arkeolog membaca situs yang tertutup vegetasi',summary:'Citra lidar dan model komputer mengungkap pola permukiman lama.',author:'Culture Desk',institution:'Heritage Lab',time:'6 menit',image:'/images/history.svg'},
    {slug:'robotika-pertanian',category:'Agriculture',title:'Robotika pertanian mempercepat transisi menuju produksi presisi',summary:'Sensor dan mesin otonom membantu petani mengurangi input.',author:'AgriTech Team',institution:'Field Lab',time:'5 menit',image:'/images/agriculture.svg'}
  ],
  topics:['Artificial Intelligence','Climate Change','Public Health','Space Exploration','Higher Education','Renewable Energy','Digital Government','Future of Work'],
  institutions:['Universitas Malikussaleh','MIT','University of Oxford','Stanford University','National University of Singapore','BRIN'],
  authors:[
    {name:'Aiyub, S.E., M.Ec., Ph.D.',role:'Economics & Digital Transformation',initials:'AY'},
    {name:'Nadia Rahman, Ph.D.',role:'Ocean and Climate Science',initials:'NR'},
    {name:'Maya Putri, M.Sc.',role:'Public Health & Environment',initials:'MP'},
    {name:'Rafi Akbar, M.Eng.',role:'AI, Robotics & Computing',initials:'RA'}
  ]
};

const en = {
  ...id,
  hero:{...id.hero,title:'Artificial Intelligence Is Transforming How Universities Discover New Knowledge',summary:'From virtual laboratories to large-scale data analysis, AI is accelerating research without replacing human scientific judgment.',time:'8 min read'},
  secondary:id.secondary.map((s,i)=>({...s,title:[
    'Next-generation solar cells break through efficiency limits',
    'Deep-ocean mission reveals a rare ecosystem',
    'Global classrooms enter the era of adaptive learning',
    'Precision health moves from research into public care'][i],time:s.time.replace('menit','min')})),
  latest:id.latest.map((s,i)=>({...s,title:[
    'Quantum computing approaches its first industrial applications',
    'Tropical cities design new defenses against extreme heat',
    'The human microbiome offers new clues about immunity',
    'The digital economy is reshaping regional productivity',
    'AI helps archaeologists read landscapes hidden by vegetation',
    'Agricultural robotics accelerates precision production'][i]}))
};
export const homeData = {id,en};
