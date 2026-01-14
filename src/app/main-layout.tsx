import Sidebar from '@/features/dashboard/ui/Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';
import { WorkspaceProvider } from '@/features/dashboard/shared/WorkspaceProvider';

export function MainLayout() {
    return (
            <WorkspaceProvider>
                <SidebarProvider>
                    <div className="flex min-h-screen bg-white w-full">
                        <Sidebar />
                        <SidebarInset>
                            <main className="w-full">
                                <Outlet />
                            </main>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </WorkspaceProvider>
    );
}
