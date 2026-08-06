import HomeSections from '@/components/enterprise/HomeSections';
export default async function HomePage({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <HomeSections locale={locale==='en'?'en':'id'}/>}
