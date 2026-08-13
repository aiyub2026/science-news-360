import VerifiedRegistration from '@/components/auth/VerifiedRegistration';

export default async function Register({
 params
}:{
 params:Promise<{locale:'id'|'en'}>
}){
 const {locale}=await params;
 return (
  <main className="verified-registration-page">
   <VerifiedRegistration locale={locale==='en'?'en':'id'}/>
  </main>
 );
}
