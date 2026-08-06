import {Locale} from '@/lib/content';
import {YouTubeGallery} from '@/components/youtube/YouTubeGallery';
export default async function Videos({params}:{params:Promise<{locale:Locale}>}){const {locale}=await params;return <><main className="video-page"><section className="video-hero"><div className="shell"><span>WATCH · LEARN · DISCOVER</span><h1>Science News 360 Video</h1><p>Penjelasan riset, materi pembelajaran, kuliah singkat, wawancara akademik, dan ulasan teknologi dalam format video.</p></div></section><section className="shell video-content"><YouTubeGallery/></section></main></>}
