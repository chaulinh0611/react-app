import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { Label } from '@/shared/ui/label';
import { useLocation, useParams } from 'react-router-dom';
import { useWorkspaceByIdQuery } from '@/entities/workspace';
import { useGetBoardById } from '@/entities/board';

export default function HeaderBreadCrumb() {
    const { pathname } = useLocation();
    const currentPath = pathname.split('/')[1];
    const { boardId, workspaceId } = useParams();

    const { data: board } = useGetBoardById(boardId as string);
    const { data: workspace } = useWorkspaceByIdQuery(workspaceId as string);

    const isBoard = currentPath === 'board';
    const isWorkspace = currentPath == 'workspace';

    if (isWorkspace) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Label>
                            <BreadcrumbLink href="/react-app/dashboard">Dashboard</BreadcrumbLink>
                        </Label>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            <Label>{workspace?.title}</Label>
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    if (isBoard) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Label>
                            <BreadcrumbLink href="/react-app/dashboard">Dashboard</BreadcrumbLink>
                        </Label>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Label>
                            <BreadcrumbLink href={`/react-app/workspace/${board?.workspace.id}`}>
                                {board?.workspace.title}
                            </BreadcrumbLink>
                        </Label>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            <Label>{board?.title}</Label>
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    if (currentPath == 'dashboard') {
        return <Label>Dashboard</Label>;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Label>
                        <BreadcrumbLink href="/react-app/dashboard">Dashboard</BreadcrumbLink>
                    </Label>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize">{currentPath}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
