import { useWorkspaces } from '@/entities/workspace/model/workspace.selector';
import { useWorkspaceStore } from '@/entities/workspace/model/workspace.store';
import {
    SidebarGroupLabel,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/shared/ui/sidebar';
import { PanelsTopLeft, Kanban } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const workspaces = useWorkspaces();

    const { getWorkspaces } = useWorkspaceStore()

    useEffect(() => {
        getWorkspaces()
    }, [getWorkspaces])
    return (
        <aside className="w-64 border-r bg-white flex flex-col justify-between">
            <div>
                <div className="p-2">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2">
                        <Kanban className="h-6 w-6 text-gray-800" />
                        <span className="text-4xl font-semibold text-gray-900">Kanby</span>
                    </Link>
                </div>

                <nav className="mt-3">
                    <SidebarGroup className="px-4 mb-4">
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-4 py-2  text-sm font-medium text-gray-800 rounded-md mb-3"
                        >
                            <PanelsTopLeft className="h-4 w-4" />
                            Dashboard
                        </Link>
                    </SidebarGroup>

                    <SidebarGroup className="p-2">
                        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                        <SidebarMenu>
                            {workspaces.map((workspace) => (
                                    <SidebarMenuItem key={workspace.id}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={`/workspace/${workspace.id}`}
                                                className="flex items-center gap-2 px-4 py-2 justify-between text-sm font-medium text-gray-800 rounded-md mb-3"
                                            >
                                                <div className='flex gap-4'>
                                                    <PanelsTopLeft className="h-4 w-4" />{' '}
                                                    {workspace.title}
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </nav>
            </div>

            <div className="p-4 border-t flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold"></div>
                <div className="text-sm leading-tight">
                    <div className="font-medium text-gray-800">User</div>
                    <div className="text-xs text-gray-500">unknown</div>
                </div>
            </div>
        </aside>
    );
}
