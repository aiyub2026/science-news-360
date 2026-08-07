import {ProtectedPage} from '@/components/auth/ProtectedPage';import {DashboardShell} from '@/components/DashboardShell';import AuthorProfileMedia from '@/components/cms/AuthorProfileMedia';
export default function Page(){return <ProtectedPage roles={['AUTHOR','SENIOR_AUTHOR']} title="Profil Penulis"><DashboardShell type="author"><AuthorProfileMedia/></DashboardShell></ProtectedPage>}
