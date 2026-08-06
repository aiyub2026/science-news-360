import LearningCatalog from '@/components/learning/LearningCatalog';
import {getLearningMaterials} from '@/lib/articles';
import {locales,type Locale} from '@/lib/home-data';
import {notFound} from 'next/navigation';
export function generateStaticParams(){return locales.map(locale=>({locale}))}
export default async function CourseMaterialsPage({params}:{params:Promise<{locale:Locale}>}){
 const {locale}=await params;if(!locales.includes(locale))notFound();const materials=getLearningMaterials(locale);
 return <main className="learning-page"><section className="learning-hero"><div className="shell"><span>SCIENCE NEWS 360 ACADEMIC LEARNING</span><h1>{locale==='id'?'Materi Kuliah untuk Pembelajaran Perguruan Tinggi':'Course Materials for Higher Education'}</h1><p>{locale==='id'?'Temukan materi, modul, tutorial, dan video pembelajaran yang disusun menurut fakultas, program studi, mata kuliah, semester, dan topik.':'Explore course materials, modules, tutorials, and learning videos organized by faculty, study program, course, semester, and topic.'}</p></div></section><section className="shell learning-content"><LearningCatalog locale={locale} materials={materials}/></section></main>
}
