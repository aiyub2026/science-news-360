import Link from 'next/link';
import {type Locale} from '@/lib/home-data';
import {getAllArticles} from '@/lib/articles';import PublishedCategoryFeed from '@/components/cms/PublishedCategoryFeed';

const labels:Record<string,{id:string;en:string}>={
 science:{id:'Sains',en:'Science'},
 technology:{id:'Teknologi',en:'Technology'},
 education:{id:'Pendidikan',en:'Education'},
 research:{id:'Riset',en:'Research'},
 opinion:{id:'Opini',en:'Opinion'}
};

export default async function Category({params}:{params:Promise<{locale:Locale,slug:string}>}){
 const {locale,slug}=await params;
 const mapped=labels[slug];
 const title=mapped?mapped[locale]:slug.charAt(0).toUpperCase()+slug.slice(1);
 const articles=getAllArticles(locale);
 return <main className="category-page">
  <section className="category-hero"><div className="shell category-hero-grid"><div><span>KNOWLEDGE DESK</span><h1>{title}</h1><p>{locale==='id'?'Berita, analisis pakar, perkembangan riset, dan perspektif akademik yang dikurasi oleh tim editorial Science News 360.':'News, expert analysis, research developments, and academic perspectives curated by the Science News 360 editorial team.'}</p></div><aside><small>EDITORIAL FOCUS</small><strong>Evidence-led reporting</strong><p>{locale==='id'?'Akurat, kontekstual, mudah dipahami, dan dapat ditelusuri sumbernya.':'Accurate, contextual, accessible, and traceable to its sources.'}</p></aside></div></section>
  <section className="shell category-content"><div className="category-title"><div><span>LATEST COVERAGE</span><h2>{locale==='id'?'Terbaru dalam':'Latest in'} {title}</h2></div><p>{locale==='id'?'Pilihan berita dan artikel untuk pembaca global.':'Selected news and articles for a global audience.'}</p></div>
   <PublishedCategoryFeed locale={locale} category={slug}/><div className="category-grid">{articles.map((article,index)=><article className="card" key={article.slug}><Link href={`/${locale}/article/${article.slug}`} className="card-visual card-visual-image" style={index>2?{filter:`hue-rotate(${index*35}deg)`}:undefined}><img src={article.image} alt={article.title}/></Link><div className="card-body"><span className="eyebrow">{article.category}</span><h3 className="serif"><Link href={`/${locale}/article/${article.slug}`}>{article.title}</Link></h3><p className="summary">{article.summary}</p><div className="meta"><span>{article.author}</span><span>{article.time}</span></div></div></article>)}</div>
  </section>
 </main>
}
