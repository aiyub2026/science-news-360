export type ContentStatus='DRAFT'|'READY'|'SUBMITTED'|'REVIEW'|'REVISION'|'ACCEPTED'|'SCHEDULED'|'PUBLISHED'|'ARCHIVED';
export type ContentType='SCIENCE_NEWS'|'POPULAR_ARTICLE'|'RESEARCH_HIGHLIGHT'|'OPINION'|'COURSE_MATERIAL'|'LEARNING_MODULE'|'ACADEMIC_TUTORIAL'|'LEARNING_VIDEO'|'INSTITUTION_NEWS';
export type VideoMethod='NONE'|'UPLOAD'|'YOUTUBE';
export type MediaMeta={id?:string;name:string;type:string;size:number;preview?:string;alt?:string;caption?:string;credit?:string;source?:string;license?:string;width?:number;height?:number;createdAt?:string};
export type AuthorEntry={name:string;email:string;affiliation:string;role:'PRIMARY'|'CO_AUTHOR';orcid?:string;googleScholar?:string;website?:string;photo?:string};
export type ContentVersion={id:string;version:number;createdAt:string;summary:string;snapshot:Partial<ContentRecord>};
export type CmsAudit={id:string;contentId:string;action:string;at:string;detail:string;actor?:string;role?:string;before?:unknown;after?:unknown};
export type ContentRecord={
 id:string;title:string;subtitle:string;summary:string;bodyHtml:string;type:ContentType;status:ContentStatus;locale:'id'|'en';
 faculty:string;studyProgram:string;course:string;degree:string;semester:string;topic:string;
 thumbnail?:MediaMeta;inlineMedia:MediaMeta[];videoMethod:VideoMethod;videoFile?:MediaMeta;youtubeUrl?:string;youtubeId?:string;youtubeThumbnail?:string;customVideoThumbnail?:MediaMeta;
 authors:AuthorEntry[];references:string;doi:string;funding:string;conflict:string;aiDisclosure:string;
 seoTitle:string;seoDescription:string;focusKeyword?:string;tags?:string[];slug:string;internalLinks?:string[];relatedMode?:'AUTO'|'MANUAL';relatedMiddleId?:string;relatedEndId?:string;
 canonicalUrl?:string;schemaType?:'NewsArticle'|'ScholarlyArticle'|'Article'|'VideoObject';openGraphTitle?:string;openGraphDescription?:string;twitterCard?:'summary'|'summary_large_image';socialImageUrl?:string;socialImageAlt?:string;editorialSeoStatus?:'NOT_STARTED'|'IN_PROGRESS'|'READY';eeatChecklist?:string[];discoverChecklist?:string[];
 priority?:'LOW'|'NORMAL'|'HIGH'|'URGENT';assignedReviewer?:string;assignedEditor?:string;editorialNotes?:string;factCheckNotes?:string;languageNotes?:string;publicationNotes?:string;scheduledAt?:string;templateId?:string;createdAt:string;updatedAt:string;submittedAt?:string;reviewStartedAt?:string;approvedAt?:string;publishedAt?:string;versions:ContentVersion[];
};
