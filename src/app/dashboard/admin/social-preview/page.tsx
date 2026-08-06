import {ProtectedPage} from '@/components/auth/ProtectedPage';
import {DashboardShell} from '@/components/DashboardShell';
import SocialPreviewTool from '@/components/cms/SocialPreviewTool';
export default function SocialPreviewPage(){return <ProtectedPage capabilities={['PUBLISH_CONTENT']} title="Pemeriksaan Tautan Berbagi"><DashboardShell type="admin"><SocialPreviewTool/></DashboardShell></ProtectedPage>}
