import {ProtectedPage} from '@/components/auth/ProtectedPage';
import EditorialSeoWorkspace from '@/components/cms/EditorialSeoWorkspace';
export default function Page(){return <ProtectedPage roles={['LANGUAGE_EDITOR','FACT_CHECKER','MANAGING_EDITOR','EDITOR_IN_CHIEF']} title="Editorial SEO Workspace"><EditorialSeoWorkspace role="editor"/></ProtectedPage>}
