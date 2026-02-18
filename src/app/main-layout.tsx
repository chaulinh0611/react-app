import AppSidebar from '@/widgets/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';
import { Header } from '@/widgets';
export function MainLayout() {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-white">
                <AppSidebar />

                <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-auto">
                        <Outlet />
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
