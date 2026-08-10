'use client';
import Link from 'next/link';import {FormEvent,useEffect,useMemo,useState} from 'react';import HomeAnalytics from '@/components/analytics/HomeAnalytics';
type PublicArticle={id:string;locale:'id'|'en';slug:string;title:string;summary:string;author:string;authorInstitution:string;category:string;publishedAt:string;thumbnailUrl:string;thumbnailAlt:string;tags:string[]};
export default function HomeSections({locale,initialArticles=[]}:{locale:'id'|'en';initialArticles?:PublicArticle[]}){const [articles,setArticles]=useState<PublicArticle[]>(initialArticles),[subscribed,setSubscribed]=useState(false);useEffect(()=>{fetch('/api/publications',{cache:'no-store'}).then(r=>r.json()).then(d=>setArticles((d.articles||[]).filter((x:PublicArticle)=>x.locale===locale).sort((a:PublicArticle,b:PublicArticle)=>new Date(b.publishedAt).getTime()-new Date(a.publishedAt).getTime()))).catch(()=>{})},[locale]);const hero=articles[0];const latest=articles.slice(1,7);const trending=useMemo(()=>{const m=new Map<string,number>();articles.forEach(a=>(a.tags||[]).forEach(t=>m.set(t,(m.get(t)||0)+1)));return [...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8)},[articles]);function subscribe(e:FormEvent<HTMLFormElement>){e.preventDefault();setSubscribed(true)}return <main><section className="breaking"><div className="shell ticker"><b>LIVE</b><div className="ticker-viewport"><div className="ticker-track"><span>{articles.length?(locale==='id'?`${articles.length} artikel telah diterbitkan dan tersedia untuk pembaca.`:`${articles.length} published articles are available to readers.`):(locale==='id'?'Science News 360 siap menerima dan meninjau artikel baru.':'Science News 360 is ready to receive and review new submissions.')}</span></div></div></div></section>

<section className="sn360-vision-hero">
  <div className="sn360-vision-overlay"></div>

  <div className="sn360-science-orbit orbit-one"></div>
  <div className="sn360-science-orbit orbit-two"></div>

  <div className="sn360-dna" aria-hidden="true">
    <i></i><i></i><i></i><i></i><i></i>
  </div>

  <div className="sn360-planet" aria-hidden="true">
    <div className="planet-glow"></div>
  </div>

  <div className="shell sn360-vision-content">
    <div className="sn360-vision-copy">

      <div className="sn360-vision-kicker">
        SCIENCE NEWS 360
        <span></span>
      </div>

      <h1>
        {locale==='id'
          ? <>
              Sains, Pengetahuan,<br/>
              dan Inovasi untuk<br/>
              <em>Masa Depan</em>
            </>
          : <>
              Science, Knowledge,<br/>
              and Innovation for a<br/>
              <em>Better Future</em>
            </>
        }
      </h1>

      <p>
        {locale==='id'
          ? 'Menghadirkan berita sains, riset, pendidikan, teknologi, dan gagasan berbasis pengetahuan untuk memperluas wawasan dan menginspirasi perubahan.'
          : 'Bringing science news, research, education, technology, and knowledge-driven ideas to broaden perspectives and inspire change.'
        }
      </p>

      <div className="sn360-vision-actions">
        <a className="sn360-explore" href="#science-news-latest">
          {locale==='id'?'Jelajahi Science News':'Explore Science News'}
          <span>→</span>
        </a>

        <Link className="sn360-author-cta" href={`/${locale}/register`}>
          {locale==='id'?'Daftar sebagai Penulis':'Register as an Author'}
          <span>→</span>
        </Link>
      </div>
    </div>

    <div className="sn360-vision-motto" aria-hidden="true">
      <span>BETTER</span>
      <strong>SCIENCE</strong>
      <span>A BRIGHTER</span>
      <strong>TOMORROW</strong>
    </div>
  </div>

  <div className="sn360-vision-topics">
    <div>
      <b>◉</b>
      <strong>{locale==='id'?'SAINS':'SCIENCE'}</strong>
      <span>{locale==='id'?'Fakta yang lebih baik':'Better facts'}</span>
    </div>
    <div>
      <b>△</b>
      <strong>{locale==='id'?'RISET':'RESEARCH'}</strong>
      <span>{locale==='id'?'Ide menjadi dampak':'Ideas into impact'}</span>
    </div>
    <div>
      <b>▣</b>
      <strong>{locale==='id'?'TEKNOLOGI':'TECHNOLOGY'}</strong>
      <span>{locale==='id'?'Solusi untuk masa depan':'Solutions for tomorrow'}</span>
    </div>
    <div>
      <b>◇</b>
      <strong>{locale==='id'?'PENDIDIKAN':'EDUCATION'}</strong>
      <span>{locale==='id'?'Pengetahuan untuk semua':'Knowledge for everyone'}</span>
    </div>
    <div>
      <b>✦</b>
      <strong>{locale==='id'?'INOVASI':'INNOVATION'}</strong>
      <span>{locale==='id'?'Menginspirasi perubahan':'Inspiring change'}</span>
    </div>
  </div>
</section>

<div id="science-news-latest"></div>

{hero?<><section className="shell hero-grid production-hero"><article className="hero-main editorial-home-hero">
<div className="hero-content">
<span>{hero.category}</span>
<h1>{hero.title}</h1>
<p>{hero.summary}</p>
<div className="hero-meta">{hero.author} · {hero.authorInstitution}</div>
<div className="hero-actions">
<Link href={`/${locale}/article/${hero.slug}`}>
{locale==='id'?'Baca Selengkapnya':'Read Story'} →
</Link>
</div>
</div>
<Link href={`/${locale}/article/${hero.slug}`} className="editorial-hero-image">
<img src={hero.thumbnailUrl} alt={hero.thumbnailAlt||hero.title}/>
</Link>
<div className="editorial-hero-caption">
<span>{hero.thumbnailAlt||hero.title}</span>
<span>Science News 360</span>
</div>
</article><div className="hero-side">{latest.slice(0,4).map(a=><article className="story-card compact" key={a.id}><Link href={`/${locale}/article/${a.slug}`} className="story-image"><img src={a.thumbnailUrl} alt={a.thumbnailAlt||a.title}/><span>{a.category}</span></Link><div className="story-copy"><Link href={`/${locale}/article/${a.slug}`}><h3>{a.title}</h3></Link><small>{a.author}</small></div></article>)}</div></section><section className="shell section"><div className="section-head"><div><span>01 / LATEST</span><h2>{locale==='id'?'Riset dan Berita Terbaru':'Latest Research & News'}</h2></div><Link href={`/${locale}/latest`}>{locale==='id'?'Lihat Semua':'View All'} →</Link></div><div className="news-grid">{latest.map(a=><article className="story-card" key={a.id}><Link href={`/${locale}/article/${a.slug}`} className="story-image"><img src={a.thumbnailUrl} alt={a.thumbnailAlt||a.title}/><span>{a.category}</span></Link><div className="story-copy"><Link href={`/${locale}/article/${a.slug}`}><h3>{a.title}</h3></Link><p>{a.summary}</p><small>{a.author}</small></div></article>)}</div></section></>:<section className="shell sn360-no-publication">
  <span>SCIENCE NEWS 360</span>
  <h2>{locale==='id'?'Artikel terbaru sedang dipersiapkan':'New stories are being prepared'}</h2>
  <p>{locale==='id'
    ?'Konten akan tampil setelah diterbitkan oleh tim editorial.'
    :'Content will appear after editorial publication.'
  }</p>
</section>}<HomeAnalytics locale={locale}/>{trending.length>0&&<section className="shell section"><div className="section-head"><div><span>02 / TRENDING</span><h2>{locale==='id'?'Topik yang Sedang Dibaca':'Trending Topics'}</h2></div></div><div className="topic-cloud">{trending.map(([t,c],i)=><Link key={t} href={`/${locale}/latest?q=${encodeURIComponent(t)}`}><b>{String(i+1).padStart(2,'0')}</b>{t}<span>{c}</span></Link>)}</div></section>}<section className="buletin"><div className="shell buletin-inner"><div><span>THE WEEKLY 360</span><h2>{locale==='id'?'Sains penting. Tanpa kebisingan.':'Essential science. Without the noise.'}</h2><p>{locale==='id'?'Ringkasan artikel terbit dan wawasan akademik terbaik.':'A weekly briefing of published stories and academic insight.'}</p></div>{subscribed?<div className="buletin-success" role="status">✓ {locale==='id'?'Terima kasih. Minat berlangganan telah tercatat.':'Thank you. Your subscription interest has been recorded.'}</div>:<form onSubmit={subscribe}><label className="sr-only" htmlFor="buletin-email">Email</label><input id="buletin-email" required type="email" placeholder="Alamat email"/><button type="submit">{locale==='id'?'Berlangganan':'Subscribe'} →</button></form>}</div></section>
<style jsx>{`
.sn360-vision-hero{
  position:relative;
  overflow:hidden;
  min-height:680px;
  margin:0;
  color:white;
  background:
    radial-gradient(circle at 82% 43%,rgba(40,151,255,.48),transparent 18%),
    radial-gradient(circle at 64% 78%,rgba(125,208,255,.28),transparent 24%),
    linear-gradient(118deg,#041b35 0%,#073766 47%,#0c5f9e 73%,#07396b 100%);
}

.sn360-vision-overlay{
  position:absolute;
  inset:0;
  background:
    linear-gradient(90deg,rgba(3,23,47,.42),transparent 58%),
    repeating-linear-gradient(
      120deg,
      transparent 0,
      transparent 62px,
      rgba(255,255,255,.018) 63px,
      transparent 64px
    );
}

.sn360-vision-content{
  position:relative;
  z-index:3;
  min-height:590px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding-top:58px;
  padding-bottom:118px;
}

.sn360-vision-copy{
  width:min(720px,60%);
}

.sn360-vision-kicker{
  display:flex;
  align-items:center;
  gap:20px;
  margin-bottom:22px;
  font-size:15px;
  font-weight:800;
  letter-spacing:.30em;
  color:#49c9ff;
}

.sn360-vision-kicker span{
  width:94px;
  height:1px;
  background:#4ed0ff;
}

.sn360-vision-copy h1{
  margin:0;
  font-size:64px;
  line-height:1.07;
  letter-spacing:-.045em;
  font-weight:650;
  color:#fff;
}

.sn360-vision-copy h1 em{
  font-style:italic;
  font-weight:800;
  color:#39c4ff;
}

.sn360-vision-copy p{
  width:min(650px,100%);
  margin:28px 0 28px;
  font-size:17px;
  line-height:1.7;
  color:#e1effb;
}

.sn360-vision-actions{
  display:flex;
  gap:18px;
  flex-wrap:wrap;
}

.sn360-explore,
.sn360-author-cta{
  min-height:54px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:24px;
  padding:0 28px;
  border-radius:999px;
  text-decoration:none;
  font-weight:800;
  transition:.2s ease;
}

.sn360-explore{
  color:#082540;
  background:#fff;
  box-shadow:0 12px 32px rgba(0,20,45,.18);
}

.sn360-author-cta{
  color:#fff;
  border:1px solid rgba(255,255,255,.72);
  background:rgba(255,255,255,.08);
  backdrop-filter:blur(8px);
}

.sn360-explore:hover,
.sn360-author-cta:hover{
  transform:translateY(-2px);
}

.sn360-vision-motto{
  position:relative;
  z-index:3;
  width:220px;
  margin-right:17%;
  display:flex;
  flex-direction:column;
  font-size:17px;
  line-height:1.42;
  letter-spacing:.13em;
  color:rgba(255,255,255,.78);
}

.sn360-vision-motto strong{
  font-size:18px;
  font-weight:600;
  color:#fff;
}

.sn360-planet{
  position:absolute;
  z-index:1;
  width:570px;
  height:570px;
  right:-155px;
  top:62px;
  border-radius:50%;
  background:
    radial-gradient(circle at 30% 38%,rgba(76,180,255,.9),transparent 11%),
    radial-gradient(circle at 44% 47%,#0c69ae 0 22%,#06427b 43%,#021d3c 72%);
  box-shadow:
    inset 40px -30px 70px rgba(0,8,26,.7),
    inset -15px 18px 45px rgba(64,188,255,.3),
    0 0 90px rgba(52,171,255,.42);
}

.planet-glow{
  position:absolute;
  inset:-14px;
  border:2px solid rgba(131,219,255,.38);
  border-radius:50%;
  box-shadow:0 0 35px rgba(69,190,255,.25);
}

.sn360-science-orbit{
  position:absolute;
  z-index:2;
  right:-90px;
  top:170px;
  width:650px;
  height:260px;
  border:2px solid rgba(211,243,255,.72);
  border-radius:50%;
  transform:rotate(-24deg);
}

.orbit-two{
  right:-55px;
  top:210px;
  transform:rotate(23deg);
}

.sn360-dna{
  position:absolute;
  z-index:2;
  right:13%;
  bottom:84px;
  width:160px;
  height:250px;
  opacity:.7;
  transform:rotate(11deg);
}

.sn360-dna:before,
.sn360-dna:after{
  content:'';
  position:absolute;
  top:0;
  width:38px;
  height:100%;
  border-left:3px solid rgba(110,220,255,.65);
  border-right:3px solid rgba(110,220,255,.65);
  border-radius:50%;
}

.sn360-dna:before{left:28px;transform:rotate(12deg)}
.sn360-dna:after{right:28px;transform:rotate(-12deg)}

.sn360-dna i{
  position:relative;
  z-index:2;
  display:block;
  width:110px;
  height:2px;
  margin:38px auto;
  background:rgba(130,223,255,.64);
  transform:rotate(-11deg);
}

.sn360-vision-topics{
  position:absolute;
  z-index:6;
  left:50%;
  bottom:-1px;
  transform:translateX(-50%);
  width:min(1420px,94%);
  min-height:126px;
  display:grid;
  grid-template-columns:repeat(5,1fr);
  background:rgba(255,255,255,.97);
  color:#092442;
  border-radius:24px 24px 0 0;
  box-shadow:0 -8px 35px rgba(0,33,72,.12);
}

.sn360-vision-topics>div{
  position:relative;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:5px;
}

.sn360-vision-topics>div:not(:last-child):after{
  content:'';
  position:absolute;
  right:0;
  height:58%;
  width:1px;
  background:#dae5f0;
}

.sn360-vision-topics b{
  display:grid;
  place-items:center;
  width:43px;
  height:43px;
  margin-bottom:2px;
  border-radius:50%;
  color:#0d65c9;
  background:#eaf4ff;
  font-size:20px;
}

.sn360-vision-topics strong{
  font-size:13px;
  letter-spacing:.08em;
}

.sn360-vision-topics span{
  font-size:12px;
  color:#698097;
}

.sn360-no-publication{
  text-align:center;
  padding:58px 20px 72px;
}

.sn360-no-publication span{
  color:#1766e7;
  font-size:12px;
  font-weight:800;
  letter-spacing:.18em;
}

.sn360-no-publication h2{
  margin:12px 0 7px;
  font-size:28px;
}

.sn360-no-publication p{
  margin:0;
  color:#6d7f91;
}

@media(max-width:900px){
  .sn360-vision-hero{min-height:720px}
  .sn360-vision-content{
    min-height:610px;
    padding-top:45px;
    align-items:flex-start;
  }
  .sn360-vision-copy{width:80%}
  .sn360-vision-copy h1{font-size:50px}
  .sn360-vision-motto{display:none}
  .sn360-planet{
    width:430px;height:430px;
    right:-220px;top:155px;
    opacity:.65;
  }
}

@media(max-width:680px){
  .sn360-vision-hero{min-height:760px}
  .sn360-vision-content{
    padding-top:38px;
    padding-bottom:175px;
  }
  .sn360-vision-copy{width:100%}
  .sn360-vision-copy h1{font-size:40px}
  .sn360-vision-copy p{font-size:15px}
  .sn360-vision-actions{flex-direction:column;align-items:flex-start}
  .sn360-explore,.sn360-author-cta{width:100%}
  .sn360-vision-topics{
    grid-template-columns:repeat(5,150px);
    overflow-x:auto;
    justify-content:start;
  }
  .sn360-planet{opacity:.4}
}
`}</style>
</main>}
