import { Sidebar } from '@/widgets/Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';
import { Header } from '@/widgets';
import { useNotificationSSE } from '@/entities/notification';
import { ThemeProvider } from '@/shared/components/ThemeProvider';
export function MainLayout() {
    useNotificationSSE();

    return (
        <ThemeProvider defaultTheme="light">
            <SidebarProvider>
                <div className="flex h-screen w-full   ">
                    <Sidebar />
                    <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-dot ">
                        <Header />
                        <main className="flex-1 h-full overflow-auto ">
                            <Outlet />
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </ThemeProvider>
    );
}
