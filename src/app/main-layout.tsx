import { Sidebar } from '@/widgets/Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';
import { Header } from '@/widgets';
import { useNotificationSSE } from '@/entities/notification';
export function MainLayout() {
    useNotificationSSE();

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-white">
                <Sidebar />
                <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                    <Header />
                    <main className="flex-1 h-full overflow-auto">
                        <Outlet />
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
