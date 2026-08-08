import {ProtectedPage} from '@/components/auth/ProtectedPage';
import {DashboardShell} from '@/components/DashboardShell';
import ContentWizard from '@/components/cms/ContentWizard';
export default function Page(){return <ProtectedPage roles={['AUTHOR','SENIOR_AUTHOR','SYSTEM_ADMINISTRATOR']} title="Halaman Penulisan"><DashboardShell type="author"><ContentWizard/></DashboardShell></ProtectedPage>}
