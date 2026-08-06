import Link from "next/link";

export default function EnterpriseFooter({locale}:{locale:"id"|"en"}){
  const info=(slug:string)=>`/${locale}/info/${slug}`;
  const isId=locale==="id";
  return <footer className="enterprise-footer">
    <div className="shell footer-grid footer-grid-enterprise">
      <div className="footer-intro">
        <Link href={`/${locale}`} className="footer-brand">SCIENCE NEWS <b>360</b></Link>
        <p>{isId?"Jurnalisme sains global, wawasan akademik, materi pembelajaran, dan pengetahuan publik dalam satu platform terpercaya.":"Global science journalism, academic insight, learning resources, and public knowledge in one trusted platform."}</p>
        <div className="socials" aria-label="Social media">
          <a href="https://www.youtube.com/@sciencenews360" target="_blank" rel="noreferrer" aria-label="YouTube">YT</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">IN</a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
          <a href="https://www.tiktok.com/@brightsteps360" target="_blank" rel="noreferrer" aria-label="TikTok">TK</a>
        </div>
      </div>
      <div><h4>{isId?"Jelajahi":"Explore"}</h4><Link href={`/${locale}/category/science`}>{isId?"Sains":"Science"}</Link><Link href={`/${locale}/category/technology`}>{isId?"Teknologi":"Technology"}</Link><Link href={`/${locale}/category/education`}>{isId?"Pendidikan":"Education"}</Link><Link href={`/${locale}/video`}>Video</Link></div>
      <div><h4>{isId?"Kontribusi":"Contribute"}</h4><Link href={`/${locale}/login?next=/dashboard/author/create`}>{isId?"Kirim Artikel":"Submit Article"}</Link><Link href={`/${locale}/authors`}>{isId?"Penulis":"Authors"}</Link><Link href={info("author-guidelines")}>{isId?"Pedoman Penulis":"Author Guidelines"}</Link><Link href={info("editorial-process")}>{isId?"Proses Editorial":"Editorial Process"}</Link></div>
      <div><h4>{isId?"Kepercayaan":"Trust"}</h4><Link href={info("editorial-policy")}>{isId?"Kebijakan Editorial":"Editorial Policy"}</Link><Link href={info("fact-checking")}>{isId?"Pemeriksaan Fakta":"Fact Checking"}</Link><Link href={info("corrections")}>{isId?"Koreksi & Pembaruan":"Corrections"}</Link><Link href={info("ai-policy")}>{isId?"Kebijakan AI":"AI Policy"}</Link><Link href={info("privacy")}>{isId?"Privasi":"Privacy"}</Link></div>
      <div><h4>{isId?"Perusahaan":"Company"}</h4><Link href={info("about")}>{isId?"Tentang Kami":"About"}</Link><Link href={info("partners")}>{isId?"Mitra":"Partners"}</Link><Link href={info("careers")}>{isId?"Karier":"Careers"}</Link><Link href={info("contact")}>{isId?"Kontak":"Contact"}</Link><Link href="/admin/login">Admin</Link></div>
    </div>
    <div className="shell footer-bottom"><span>© 2026 Science News 360. Knowledge Without Borders.</span><span>{isId?"Transparansi editorial · Integritas akademik · Manfaat publik":"Editorial transparency · Academic integrity · Public benefit"}</span></div>
  </footer>
}
