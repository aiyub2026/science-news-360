import {ProtectedPage} from '@/components/auth/ProtectedPage';
import EditorialSeoWorkspace from '@/components/cms/EditorialSeoWorkspace';
export default function Page(){return <ProtectedPage roles={['REVIEWER']} title="Reviewer SEO Workspace"><EditorialSeoWorkspace role="reviewer"/></ProtectedPage>}
