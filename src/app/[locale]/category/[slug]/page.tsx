import Link from 'next/link';
import {listPublishedArticles} from '@/lib/server-publications';

export const dynamic='force-dynamic';

function normalize(value:string=''){
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[_\s]+/g,'-')
    .replace(/[^a-z0-9-]/g,'');
}

const opinionSlugs=new Set([
  'opinion',
  'opini',
  'expert-opinion',
  'editorial',
  'commentary',
  'policy-analysis',
  'science-and-society'
]);

const researchSlugs=new Set([
  'research',
  'research-news',
  'new-publications',
  'data-and-visualization',
  'funding',
  'collaboration',
  'call-for-papers'
]);

const educationSlugs=new Set([
  'education',
  'higher-education',
  'research-methods'
]);

const technologySlugs=new Set([
  'technology',
  'artificial-intelligence',
  'robotics',
  'quantum-computing',
  'cybersecurity',
  'blockchain',
  'biotechnology'
]);

const scienceSlugs=new Set([
  'science',
  'biology',
  'physics',
  'health-and-medicine',
  'climate',
  'space-and-astronomy',
  'earth-science'
]);

function matchesChannel(article:any,slug:string){
  const type=String(article.type||'').toUpperCase();

  const searchable=[
    article.category,
    ...(article.tags||[])
  ].map((v:any)=>normalize(String(v||'')));

  const exact=searchable.includes(slug);

  if(exact)return true;

  // Artikel OPINION generik masuk ke kanal utama Opini/Opini Pakar.
  // Subkanal khusus hanya menerima artikel dengan metadata yang sesuai.
  if(
    ['opinion','opini','expert-opinion'].includes(slug) &&
    type==='OPINION'
  )return true;

  if(researchSlugs.has(slug) && type==='RESEARCH_HIGHLIGHT')return true;

  if(educationSlugs.has(slug) && [
    'COURSE_MATERIAL',
    'LEARNING_MODULE',
    'ACADEMIC_TUTORIAL',
    'LEARNING_VIDEO'
  ].includes(type))return true;

  if(technologySlugs.has(slug)){
    return searchable.some(v=>
      technologySlugs.has(v) ||
      v.includes('technology') ||
      v.includes('teknologi') ||
      v.includes('artificial-intelligence') ||
      v.includes('ai')
    );
  }

  if(scienceSlugs.has(slug)){
    return (
      type==='SCIENCE_NEWS' ||
      searchable.some(v=>scienceSlugs.has(v))
    );
  }

  return false;
}

function titleFor(slug:string,locale:'id'|'en'){
  const labels:Record<string,[string,string]>={
    science:['Sains','Science'],
    technology:['Teknologi','Technology'],
    education:['Pendidikan','Education'],
    research:['Riset','Research'],
    opinion:['Opini','Opinion'],
    'expert-opinion':['Opini Pakar','Expert Opinion'],
    editorial:['Editorial','Editorial'],
    commentary:['Komentar & Analisis','Commentary'],
    'policy-analysis':['Analisis Kebijakan','Policy Analysis'],
    'science-and-society':['Sains dan Masyarakat','Science & Society'],
    biology:['Biologi','Biology'],
    physics:['Fisika','Physics'],
    'artificial-intelligence':['Kecerdasan Buatan','Artificial Intelligence'],
    'research-news':['Berita Riset','Research News'],
    'higher-education':['Pendidikan Tinggi','Higher Education']
  };

  const match=labels[slug];

  if(match)return locale==='id'?match[0]:match[1];

  return slug
    .split('-')
    .map(x=>x.charAt(0).toUpperCase()+x.slice(1))
    .join(' ');
}

export default async function CategoryPage({
  params
}:{
  params:Promise<{
    locale:string;
    slug?:string;
    category?:string;
  }>
}){
  const resolved=await params;

  const locale:'id'|'en'=resolved.locale==='en'?'en':'id';

  const slug=normalize(
    resolved.slug ||
    resolved.category ||
    ''
  );

  const published=(await listPublishedArticles())
    .filter(article=>article.locale===locale)
    .filter(article=>matchesChannel(article,slug))
    .sort(
      (a,b)=>
        new Date(b.publishedAt).getTime()-
        new Date(a.publishedAt).getTime()
    );

  const title=titleFor(slug,locale);

  return (
    <main className="channel-page">

      <section className="channel-header">
        <div className="shell">
          <span>SCIENCE NEWS 360</span>
          <h1>{title}</h1>
          <p>
            {locale==='id'
              ?'Artikel, riset, berita, dan wawasan pilihan dari Science News 360.'
              :'Selected articles, research, news, and insight from Science News 360.'
            }
          </p>
        </div>
      </section>

      <section className="shell channel-content">

        {published.length ? (
          <>
            <div className="channel-count">
              {published.length} {locale==='id'?'artikel terbit':'published articles'}
            </div>

            <div className="channel-grid">
              {published.map(article=>(
                <article key={article.id} className="channel-card">

                  <Link
                    href={`/${locale}/article/${article.slug}`}
                    className="channel-image"
                  >
                    <img
                      src={article.thumbnailUrl}
                      alt={article.thumbnailAlt||article.title}
                    />
                  </Link>

                  <div className="channel-copy">

                    <span>
                      {article.category||title}
                    </span>

                    <Link href={`/${locale}/article/${article.slug}`}>
                      <h2>{article.title}</h2>
                    </Link>

                    <p>{article.summary}</p>

                    <small>
                      {article.author} · {
                        new Date(article.publishedAt)
                          .toLocaleDateString(
                            locale==='id'?'id-ID':'en-US'
                          )
                      }
                    </small>

                  </div>
                </article>
              ))}
            </div>
          </>
        ):(
          <div className="channel-empty">
            <span>SCIENCE NEWS 360</span>
            <h2>
              {locale==='id'
                ?`Belum ada artikel terbit di kanal ${title}.`
                :`No published articles in ${title} yet.`
              }
            </h2>
            <p>
              {locale==='id'
                ?'Artikel akan tampil otomatis setelah diterbitkan oleh tim editorial.'
                :'Articles will appear automatically after editorial publication.'
              }
            </p>
          </div>
        )}

      </section>
    </main>
  );
}
