import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWorkspaceStore } from '@/entities/workspace/model/workspace.store';

export default function WorkspaceMembersPage() {
    const { workspaceId } = useParams();
    const { currentWorkspace, getWorkspaceById } = useWorkspaceStore();

    useEffect(() => {
        if (workspaceId) {
            getWorkspaceById(workspaceId);
        }
    }, [workspaceId, getWorkspaceById]);

    return (
        <div>
            <div className="space-y-15 p-8 pt-8">
                <div>
                    <h1 className="text-3xl font-bold">{currentWorkspace?.title ?? 'Workspace'}</h1>
                    <p className="text-muted-foreground">
                        {currentWorkspace?.description ?? 'Workspace description'}
                    </p>
                </div>
                <hr />
                <div></div>
            </div>
        </div>
    );
}
