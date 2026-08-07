export const ROLES = ['READER','CONTRIBUTOR','AUTHOR','SENIOR_AUTHOR','REVIEWER','LANGUAGE_EDITOR','FACT_CHECKER','MANAGING_EDITOR','EDITOR_IN_CHIEF','PUBLISHER','ADMINISTRATOR','SYSTEM_ADMINISTRATOR'] as const;
export type Role = typeof ROLES[number];
export type ApplicationStatus='NONE'|'PENDING'|'APPROVED'|'REJECTED';
export type AuthUser = {id:string;name:string;email:string;role:Role;verified:boolean;profileComplete:boolean;orcid?:string;institution?:string;applicationStatus?:ApplicationStatus};
export const roleDashboard:Record<Role,string>={
 READER:'/dashboard/reader',CONTRIBUTOR:'/dashboard/contributor',AUTHOR:'/dashboard/author',SENIOR_AUTHOR:'/dashboard/author',REVIEWER:'/dashboard/reviewer',LANGUAGE_EDITOR:'/dashboard/editor',FACT_CHECKER:'/dashboard/editor',MANAGING_EDITOR:'/dashboard/editor',EDITOR_IN_CHIEF:'/dashboard/editor',PUBLISHER:'/dashboard/publisher',ADMINISTRATOR:'/dashboard/admin',SYSTEM_ADMINISTRATOR:'/dashboard/system-admin'
};
export const roleLabels:Record<Role,string>={READER:'Pembaca',CONTRIBUTOR:'Kontributor',AUTHOR:'Penulis',SENIOR_AUTHOR:'Penulis Senior',REVIEWER:'Peninjau',LANGUAGE_EDITOR:'Editor Bahasa',FACT_CHECKER:'Pemeriksa Fakta',MANAGING_EDITOR:'Editor Pelaksana',EDITOR_IN_CHIEF:'Pemimpin Redaksi',PUBLISHER:'Penerbit',ADMINISTRATOR:'Administrator',SYSTEM_ADMINISTRATOR:'Administrator Sistem'};
