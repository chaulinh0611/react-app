import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BoardApi } from '@/entities/board/api/board.api';
import { Button } from '@/shared/ui/button/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/shared/ui/card';
import { Loader2, AlertCircle, ArchiveRestore } from 'lucide-react';

export default function ArchivedBoards() {
    const queryClient = useQueryClient();

    const {
        data: boards,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['archivedBoards'],
        queryFn: async () => {
            return BoardApi.getArchivedBoards();
        },
    });

    const reopenMutation = useMutation({
        mutationFn: (boardId: string) => BoardApi.reopenBoard(boardId),
        onSuccess: () => {
            toast.success('Board restored successfully!');
            queryClient.invalidateQueries({ queryKey: ['archivedBoards'] });
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || 'Failed to restore board';
            toast.error(msg);
        },
    });

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-8 flex justify-center">
                    <Loader2 className="animate-spin text-blue-500" />
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="shadow-sm border-none bg-white rounded-2xl w-full">
                <CardContent className="p-8 text-center text-red-500">
                    <p>Failed to load archived boards.</p>
                </CardContent>
            </Card>
        );
    }

    const archivedBoards = boards || [];

    return (
        <Card className="shadow-sm border-none bg-white rounded-2xl w-full">
            <CardContent className="p-8">
                <div className="mb-6 border-b pb-4">
                    <h3 className="text-lg font-bold text-gray-900">Archived Boards</h3>
                    <p className="text-sm text-gray-500">
                        Boards you have archived. You can restore them here.
                    </p>
                </div>

                {archivedBoards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                        <p>No archived boards found.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {archivedBoards.map((board: any) => (
                            <div
                                key={board.id}
                                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                            >
                                <div>
                                    <h4 className="font-semibold">{board.title}</h4>
                                    {board.workspace && (
                                        <p className="text-sm text-gray-500">
                                            Workspace: {board.workspace.title}
                                        </p>
                                    )}
                                    {board.description && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {board.description}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => reopenMutation.mutate(board.id)}
                                    disabled={
                                        reopenMutation.isPending &&
                                        reopenMutation.variables === board.id
                                    }
                                    className="flex items-center gap-2 shrink-0"
                                >
                                    {reopenMutation.isPending &&
                                    reopenMutation.variables === board.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ArchiveRestore className="w-4 h-4" />
                                    )}
                                    Send to board
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
