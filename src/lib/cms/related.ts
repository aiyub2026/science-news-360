import {ContentRecord} from './types';

const normalize=(value:string)=>value.toLowerCase().replace(/<[^>]+>/g,' ').replace(/[^a-z0-9\u00c0-\u024f\u1e00-\u1eff]+/g,' ').split(/\s+/).filter(x=>x.length>3);
const overlap=(a:string,b:string)=>{const aa=new Set(normalize(a));return normalize(b).reduce((n,x)=>n+(aa.has(x)?1:0),0)};

export function relatedScore(source:ContentRecord,candidate:ContentRecord){
 let score=0;
 if(source.type===candidate.type)score+=12;
 if(source.topic&&candidate.topic&&source.topic.toLowerCase()===candidate.topic.toLowerCase())score+=10;
 if(source.course&&candidate.course&&source.course.toLowerCase()===candidate.course.toLowerCase())score+=7;
 if(source.faculty&&candidate.faculty&&source.faculty.toLowerCase()===candidate.faculty.toLowerCase())score+=4;
 const sourceTags=new Set((source.tags||[]).map(x=>x.toLowerCase()));score+=(candidate.tags||[]).reduce((n,x)=>n+(sourceTags.has(x.toLowerCase())?6:0),0);
 const sourceText=[source.title,source.summary,source.focusKeyword||'',source.topic,source.bodyHtml].join(' ');
 const candidateText=[candidate.title,candidate.summary,candidate.focusKeyword||'',candidate.topic,candidate.bodyHtml].join(' ');
 score+=Math.min(15,overlap(sourceText,candidateText));
 return score;
}

export function chooseRelated(source:ContentRecord,rows:ContentRecord[]){
 const candidates=rows.filter(x=>x.id!==source.id&&x.status==='PUBLISHED'&&x.locale===source.locale&&!!x.slug)
  .sort((a,b)=>relatedScore(source,b)-relatedScore(source,a)||new Date(b.publishedAt||b.updatedAt).getTime()-new Date(a.publishedAt||a.updatedAt).getTime());
 const manualMiddle=source.relatedMiddleId?candidates.find(x=>x.id===source.relatedMiddleId):undefined;
 const manualEnd=source.relatedEndId?candidates.find(x=>x.id===source.relatedEndId):undefined;
 if(source.relatedMode==='MANUAL'){
  const middle=manualMiddle||candidates[0];
  const end=(manualEnd&&manualEnd.id!==middle?.id)?manualEnd:candidates.find(x=>x.id!==middle?.id);
  return [middle,end].filter(Boolean) as ContentRecord[];
 }
 return candidates.slice(0,2);
}
