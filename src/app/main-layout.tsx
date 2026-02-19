import { useEffect } from 'react';
import AppSidebar from '@/widgets/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';
import { Header } from '@/widgets';
import { useUserStore } from '@/entities/users/model/user.store';

export function MainLayout() {
    const { fetchUser, user } = useUserStore();

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [fetchUser, user]);

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-white">
                <AppSidebar />

                <SidebarInset className="flex flex-col flex-1">
                    <Header />

                    <main className="w-4/5 mx-auto">
                        <Outlet />
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}