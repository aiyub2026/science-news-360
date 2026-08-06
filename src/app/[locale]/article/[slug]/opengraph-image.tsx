import {ImageResponse} from 'next/og';
import {getArticle} from '@/lib/articles';

export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

function fromSlug(slug:string){return decodeURIComponent(slug).split('-').filter(Boolean).map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(' ')}

export default async function OpenGraphImage({params}:{params:Promise<{locale:'id'|'en';slug:string}>}){
 const {locale,slug}=await params;
 const article=getArticle(locale,slug);
 const title=article?.title||fromSlug(slug)||'Science News 360';
 const category=article?.category||(locale==='id'?'Artikel Pilihan':'Featured Article');
 return new ImageResponse(<div style={{height:'100%',width:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'68px 76px',background:'linear-gradient(135deg,#07152d 0%,#0d3159 60%,#176a86 100%)',color:'white',fontFamily:'Arial'}}>
  <div style={{display:'flex',alignItems:'center',gap:22}}><div style={{width:92,height:92,borderRadius:46,border:'4px solid #65d7ff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,fontWeight:800}}>360</div><div style={{display:'flex',flexDirection:'column'}}><div style={{fontSize:42,fontWeight:800}}>SCIENCE NEWS</div><div style={{fontSize:22,color:'#b9def3'}}>Global Science, Education & Innovation</div></div></div>
  <div style={{display:'flex',flexDirection:'column',gap:18,maxWidth:1000}}><div style={{fontSize:24,color:'#6fe2ff',fontWeight:700,textTransform:'uppercase'}}>{category}</div><div style={{fontSize:title.length>90?48:58,lineHeight:1.12,fontWeight:800,letterSpacing:-1}}>{title}</div></div>
  <div style={{fontSize:22,color:'#c9e2ee'}}>sciencenews360.com</div>
 </div>,size)
}
