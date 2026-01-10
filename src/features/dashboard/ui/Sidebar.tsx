import {
    SidebarGroupLabel,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/shared/ui/sidebar';
import { PanelsTopLeft, Kanban, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWorkspaceContext, WorkspaceProvider } from '../shared/WorkspaceProvider';

export default function Sidebar() {
    const { workspaces } = useWorkspaceContext();
    return (
        <WorkspaceProvider>
            <aside className="w-64 border-r bg-white flex flex-col justify-between">
                <div>
                    <div className="p-2">
                        <button
                            type="button"
                            className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 h-12 text-left text-sm outline-hidden transition hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-gray-100"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <Kanban className="size-4" />
                            </div>

                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate font-semibold text-gray-900"></span>
                                <span className="truncate text-xs text-gray-500"></span>
                            </div>

                            <ChevronDown className="ml-auto size-4 text-gray-500" />
                        </button>
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
                                                className="flex items-center gap-2 px-4 py-2  text-sm font-medium text-gray-800 rounded-md mb-3"
                                            >
                                                <PanelsTopLeft className="h-4 w-4" />{' '}
                                                {workspace.title}
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
        </WorkspaceProvider>
    );
}
