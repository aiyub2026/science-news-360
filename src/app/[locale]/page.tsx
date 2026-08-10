import HomeSections from '@/components/enterprise/HomeSections';
import {listPublishedArticles} from '@/lib/server-publications';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  params
}:{
  params:Promise<{locale:string}>
}){
  const {locale:rawLocale}=await params;
  const locale:'id'|'en'=rawLocale==='en'?'en':'id';

  const published=(await listPublishedArticles())
    .filter(article=>article.locale===locale)
    .sort(
      (a,b)=>
        new Date(b.publishedAt).getTime()-
        new Date(a.publishedAt).getTime()
    );

  return <HomeSections locale={locale} initialArticles={published}/>;
}
