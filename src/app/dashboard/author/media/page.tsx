import {ProtectedPage} from '@/components/auth/ProtectedPage';import {DashboardShell} from '@/components/DashboardShell';import MediaLibrary from '@/components/cms/MediaLibrary';
export default function Page(){return <ProtectedPage roles={['CONTRIBUTOR','AUTHOR','SENIOR_AUTHOR']} title="Galeri Media"><DashboardShell type="author"><MediaLibrary/></DashboardShell></ProtectedPage>}
