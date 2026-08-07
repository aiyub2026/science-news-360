import type {Locale,Story} from './home-data';
export type ArticleRecord=Story&{kind:'news'|'course-material'|'learning-module'|'tutorial'|'learning-video';faculty?:string;program?:string;course?:string;level?:string;semester?:string;topic?:string;learningOutcomes?:string[];publishedAt?:string;updatedAt?:string;doi?:string;citation?:string;videoId?:string};
export function getAllArticles(_locale:Locale):ArticleRecord[]{return []}
export function getArticle(_locale:Locale,_slug:string):ArticleRecord|undefined{return undefined}
export function getLearningMaterials(_locale:Locale):ArticleRecord[]{return []}
