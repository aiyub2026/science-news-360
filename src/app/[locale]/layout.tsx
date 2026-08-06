import EnterpriseHeader from '@/components/enterprise/EnterpriseHeader';
import EnterpriseFooter from '@/components/enterprise/EnterpriseFooter';
export function generateStaticParams(){return [{locale:'id'},{locale:'en'}]}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;const safe=locale==='en'?'en':'id';return <><EnterpriseHeader locale={safe}/>{children}<EnterpriseFooter locale={safe}/></>}
