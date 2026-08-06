import Link from "next/link";import PublishedAuthorsFeed from "@/components/cms/PublishedAuthorsFeed";

const authors=[
 {slug:"aiyub",name:"Aiyub, S.E., M.Ec., Ph.D.",initials:"AA",field:"Ekonomi, kepemimpinan digital, dan sains data",institution:"Universitas Malikussaleh",articles:12,views:"184K",bio:"Akademisi dan penulis yang berfokus pada ekonomi pembangunan, transformasi digital, riset, dan pembelajaran perguruan tinggi."},
 {slug:"nadia-rahman",name:"Nadia Rahman, Ph.D.",initials:"NR",field:"Kesehatan publik dan komunikasi sains",institution:"Global Health Institute",articles:18,views:"231K",bio:"Peneliti kesehatan publik yang menerjemahkan bukti ilmiah menjadi pengetahuan yang mudah dipahami masyarakat."},
 {slug:"david-chen",name:"David Chen, Ph.D.",initials:"DC",field:"Kecerdasan buatan dan teknologi kuantum",institution:"Institute for Advanced Computing",articles:15,views:"206K",bio:"Peneliti komputasi yang menulis tentang AI, teknologi kuantum, dan perubahan lanskap riset global."},
 {slug:"maria-alvarez",name:"Maria Alvarez, Ph.D.",initials:"MA",field:"Iklim, laut, dan kebijakan lingkungan",institution:"Ocean & Climate Research Center",articles:21,views:"287K",bio:"Ilmuwan iklim yang menghubungkan data lingkungan, kebijakan publik, dan ketahanan masyarakat."},
 {slug:"samuel-okoro",name:"Samuel Okoro, Ph.D.",initials:"SO",field:"Energi, inovasi, dan pembangunan berkelanjutan",institution:"African Energy Futures Lab",articles:11,views:"142K",bio:"Analis energi dan pembangunan yang membahas transisi energi dan inovasi untuk negara berkembang."},
 {slug:"lina-putri",name:"Lina Putri, M.Sc.",initials:"LP",field:"Pendidikan digital dan learning analytics",institution:"ASEAN Learning Innovation Network",articles:14,views:"168K",bio:"Praktisi pendidikan digital yang meneliti pembelajaran adaptif, analitik belajar, dan desain pengalaman mahasiswa."}
];

export default async function AuthorsPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params; const id=locale!=="en";
 return <main className="authors-page">
  <section className="authors-hero"><div className="shell authors-hero-grid"><div><span>{id?"KOMUNITAS AHLI":"EXPERT COMMUNITY"}</span><h1>{id?"Penulis & Pakar":"Authors & Experts"}</h1><p>{id?"Temui akademisi, peneliti, praktisi, dan komunikator sains yang membangun pengetahuan di Science News 360.":"Meet the academics, researchers, practitioners, and science communicators behind Science News 360."}</p></div><aside><strong>{authors.length}</strong><span>{id?"Pakar unggulan":"Featured experts"}</span><strong>91</strong><span>{id?"Artikel terbit":"Published articles"}</span></aside></div></section>
  <section className="shell authors-content"><div className="authors-toolbar"><div><span>{id?"DIREKTORI PENULIS":"AUTHOR DIRECTORY"}</span><h2>{id?"Keahlian yang dapat dipercaya":"Trusted expertise"}</h2></div><input aria-label="Search authors" placeholder={id?"Cari nama, bidang, atau institusi":"Search name, field, or institution"}/></div>
   <div className="authors-grid">{authors.map(a=><article className="author-profile-card" key={a.slug}><div className="author-card-top"><div className="author-avatar-pro">{a.initials}</div><div><small>{a.institution}</small><h3>{a.name}</h3><p className="author-field">{a.field}</p></div></div><p className="author-bio">{a.bio}</p><div className="author-stats"><span><b>{a.articles}</b>{id?"Artikel":"Articles"}</span><span><b>{a.views}</b>{id?"Pembaca":"Readers"}</span></div><Link className="author-profile-link" href={`/${locale}/authors/${a.slug}`}>{id?"Lihat Profil Lengkap":"View Full Profile"}<span>→</span></Link></article>)}</div>
  </section>
 <PublishedAuthorsFeed locale={locale==="en"?"en":"id"}/></main>
}
