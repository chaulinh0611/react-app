import { useWorkspaces } from '@/entities/workspace/model/workspace.selector';
import { useWorkspaceStore } from '@/entities/workspace/model/workspace.store';
import { SidebarGroupLabel, SidebarGroup } from '@/shared/ui/sidebar';

import { PanelsTopLeft, Origami, LayoutPanelTop } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavMain } from './NavMain';
import { NavUser } from './NavUser';
import { Sidebar } from '@/shared/ui/sidebar';

export default function AppSidebar() {
    const workspaces = useWorkspaces();
    const { getWorkspaces } = useWorkspaceStore();

    useEffect(() => {
        getWorkspaces();
    }, [getWorkspaces]);

    return (
        <Sidebar
            collapsible="offcanvas"
            className="w-64 border-r bg-gray-50 flex flex-col justify-between z-40"
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2">
                        <Origami className="w-8 h-8  font-bold" />
                        <span className="text-4xl font-bold text-gray-900">Kanby</span>
                    </Link>
                </div>

                <nav className="mt-3">
                    <SidebarGroup className="px-4 mb-4">
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md mb-1 transition-colors"
                        >
                            <PanelsTopLeft className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            to="/template"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md mb-1 transition-colors"
                        >
                            <LayoutPanelTop className="h-4 w-4" />
                            Template
                        </Link>
                    </SidebarGroup>
                    <div>
                        <NavMain workspaces={workspaces} />
                    </div>
                </nav>
            </div>

            <div className="p-4 border-t mt-auto">
                <NavUser />
            </div>
        </Sidebar>
    );
}
