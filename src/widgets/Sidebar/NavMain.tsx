import {
    SidebarGroupLabel,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/shared/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { Link } from 'react-router-dom';
import type { Workspace } from '@/entities/workspace/model/workspace.type';
import { Button } from '@/shared/ui/button';
import { ArrowBigLeft, ChevronRight, List, Settings, User2 } from 'lucide-react';

interface Props {
    workspaces: Workspace[];
}

export const NavMain = ({ workspaces }: Props) => {
    return (
        <SidebarGroup className="px-4">
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
                {workspaces.map((w) => {
                    return (
                        <Collapsible key={w.id}>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start">
                                    <ChevronRight />
                                    {w.title}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenu>
                                    <SidebarMenuItem className="px-4">
                                        <Link
                                            className="text-[14px] w-full"
                                            to={`/workspace/${w.id}`}
                                        >
                                            <SidebarMenuButton className="text-gray-700">
                                                <List className="w-6 h-6" />
                                                Board
                                            </SidebarMenuButton>
                                        </Link>
                                        <Link
                                            className="text-[14px] w-full"
                                            to={`/workspace/${w.id}/members`}
                                        >
                                            <SidebarMenuButton className="text-gray-700">
                                                <User2 className="w-6 h-6" />
                                                Members
                                            </SidebarMenuButton>
                                        </Link>
                                        <Link
                                            className="text-[14px] w-full"
                                            to={`/workspace/${w.id}/settings`}
                                        >
                                            <SidebarMenuButton className="text-gray-700">
                                                <Settings className="w-6 h-6" />
                                                Settings
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
};
