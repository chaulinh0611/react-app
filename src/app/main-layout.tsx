import AppSidebar from '@/widgets/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';
import { Header } from '@/widgets';
import { useNotificationSSE } from '@/entities/notification/hooks/useNotificationSSE';
export function MainLayout() {
    useNotificationSSE();

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-white">
                <AppSidebar />
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
