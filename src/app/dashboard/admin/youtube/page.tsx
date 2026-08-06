import {ProtectedPage} from '@/components/auth/ProtectedPage';
import {DashboardShell} from '@/components/DashboardShell';
import {YouTubeAdminSettings} from '@/components/youtube/YouTubeAdminSettings';
export default function YouTubeAdminPage(){return <ProtectedPage roles={['ADMINISTRATOR']} title="Pengaturan YouTube"><DashboardShell type="admin"><div className="admin-overview-head"><div><span className="eyebrow">PENGELOLAAN VIDEO</span><h1>Pengaturan YouTube</h1><p>Hubungkan channel resmi atau tambahkan video tertentu untuk ditampilkan pada Science News 360.</p></div></div><YouTubeAdminSettings/></DashboardShell></ProtectedPage>}
