import {ProtectedPage} from '@/components/auth/ProtectedPage';import {DashboardShell} from '@/components/DashboardShell';import MyContent from '@/components/cms/MyContent';
export default function Page(){return <ProtectedPage roles={['CONTRIBUTOR','AUTHOR','SENIOR_AUTHOR']} title="Konten Saya"><DashboardShell type="author"><MyContent/></DashboardShell></ProtectedPage>}
