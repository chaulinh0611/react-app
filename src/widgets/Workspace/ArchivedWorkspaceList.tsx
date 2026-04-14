import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkspaceApi } from '@/entities/workspace/api/workspace.api';
import { Loader2, ArchiveRestore, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button/button';
import { toast } from 'sonner';
import { useArchivedWorkspacesQuery } from '@/entities/workspace/model/workspace.queries';

export function ArchivedWorkspaces() {
    const queryClient = useQueryClient();

    const { data: workspaces, isLoading, isError } = useArchivedWorkspacesQuery();

    const unarchiveMutation = useMutation({
        mutationFn: (workspaceId: string) => WorkspaceApi.unarchiveWorkspace(workspaceId),
        onSuccess: () => {
            toast.success('Workspace unarchived successfully!');
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || 'Failed to unarchive workspace';
            toast.error(msg);
        },
    });

    if (isLoading) {
        return (
            <Card className="shadow-sm border-none bg-white rounded-2xl w-full">
                <CardContent className="p-8 flex justify-center">
                    <Loader2 className="animate-spin text-blue-500" />
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="shadow-sm border-none bg-white rounded-2xl w-full">
                <CardContent className="p-8 pb-4 text-center text-red-500">
                    <p>Failed to load workspaces.</p>
                </CardContent>
            </Card>
        );
    }

    const archivedWorkspaces = (workspaces || []).filter((ws: any) => ws.isArchived);

    return (
        <Card className="shadow-sm border-none bg-white rounded-2xl w-full">
            <CardContent className="p-8">
                <div className="mb-6 border-b pb-4">
                    <h3 className="text-lg font-bold text-gray-900">Archived Workspaces</h3>
                    <p className="text-sm text-gray-500">
                        Workspaces you have archived. You can restore them here.
                    </p>
                </div>

                {archivedWorkspaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                        <p>No archived workspaces found.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {archivedWorkspaces.map((ws: any) => (
                            <div
                                key={ws.id}
                                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                            >
                                <div className="min-w-0 mr-4">
                                    <h4 className="font-semibold break-all italic">{ws.title}</h4>
                                    {ws.description && (
                                        <p className="text-sm text-gray-500 break-words">{ws.description}</p>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => unarchiveMutation.mutate(ws.id)}
                                    disabled={unarchiveMutation.isPending}
                                    className="flex items-center gap-2"
                                >
                                    {unarchiveMutation.isPending &&
                                    unarchiveMutation.variables === ws.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ArchiveRestore className="w-4 h-4" />
                                    )}
                                    Unarchive
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
