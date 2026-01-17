import { Kanban } from 'lucide-react';
import { BoardCard } from './BoardCard';
import { Button } from '@/shared/ui/button';
import { useWorkspaces } from '@/entities/workspace/model/workspace.selector';

export const WorkspaceList = () => {
    const workspaces = useWorkspaces()
    return (
        <div>
            {workspaces.map((workspace: any) => (
                <div key={workspace.id} className="p-4 mb-4">
                    <div className="flex justify-between">
                        <h3 className="text-xl font-semibold mb-2">
                            <Kanban className="inline-block mr-2 rounded-sm" />
                            {workspace.title}
                        </h3>
                        <Button className="mb-4" variant={'outline'}>
                            ＋ New Board
                        </Button>
                    </div>

                    <div>
                        {workspace.boards && workspace.boards.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {workspace.boards?.map((board: any) => (
                                    <BoardCard key={board.id} board={board} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No boards available in this workspace.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
