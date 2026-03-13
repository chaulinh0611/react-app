import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkspaceApi } from '@/entities/workspace/api/workspace.api';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Loader2, Archive, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkspaceSettingsPage() {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: workspace, isLoading } = useQuery({
        queryKey: ['workspace', workspaceId],
        queryFn: async () => {
            const res = await WorkspaceApi.getWorkspaceById(workspaceId!);
            return res.data;
        },
        enabled: !!workspaceId,
    });

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Initialize form once workspace loaded
    const initialized = useState(false);
    if (workspace && !initialized[0]) {
        setTitle(workspace.title || '');
        setDescription(workspace.description || '');
        initialized[1](true);
    }

    const updateMutation = useMutation({
        mutationFn: (payload: { title: string; description: string }) =>
            WorkspaceApi.updateWorkspace(workspaceId!, payload),
        onSuccess: () => {
            toast.success('Workspace updated successfully');
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update workspace');
        },
    });

    const archiveMutation = useMutation({
        mutationFn: () => WorkspaceApi.archiveWorkspace(workspaceId!),
        onSuccess: () => {
            toast.success('Workspace archived');
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            navigate('/dashboard');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to archive workspace');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => WorkspaceApi.deleteWorkspace(workspaceId!),
        onSuccess: () => {
            toast.success('Workspace deleted permanently');
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            navigate('/dashboard');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to delete workspace');
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <Settings className="h-6 w-6 text-gray-500" />
                <h1 className="text-2xl font-bold">Workspace Settings</h1>
            </div>

            {/* General Info */}
            <Card className="shadow-sm border-none bg-white rounded-2xl">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-base font-semibold border-b pb-3">General</h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Workspace name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Workspace description (optional)"
                            rows={3}
                        />
                    </div>

                    <Button
                        onClick={() => updateMutation.mutate({ title, description })}
                        disabled={updateMutation.isPending || !title.trim()}
                    >
                        {updateMutation.isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="shadow-sm border border-red-200 bg-white rounded-2xl">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-base font-semibold text-red-600 border-b border-red-100 pb-3">
                        Danger Zone
                    </h2>

                    {/* Archive */}
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <h3 className="font-medium text-sm">Archive this workspace</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                The workspace will be hidden from the sidebar. You can restore it from your Profile page.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 shrink-0 ml-4"
                            onClick={() => {
                                if (confirm(`Archive workspace "${workspace?.title}"? You can restore it from your Profile.`)) {
                                    archiveMutation.mutate();
                                }
                            }}
                            disabled={archiveMutation.isPending}
                        >
                            {archiveMutation.isPending
                                ? <Loader2 className="animate-spin h-4 w-4" />
                                : <Archive className="h-4 w-4" />
                            }
                            Archive
                        </Button>
                    </div>

                    {/* Delete */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <div>
                            <h3 className="font-medium text-sm">Delete this workspace</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                This action is permanent and cannot be undone. All boards and data will be lost.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            className="gap-2 shrink-0 ml-4"
                            onClick={() => {
                                if (confirm(`⚠️ Permanently delete "${workspace?.title}"? This CANNOT be undone.`)) {
                                    deleteMutation.mutate();
                                }
                            }}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending
                                ? <Loader2 className="animate-spin h-4 w-4" />
                                : <Trash2 className="h-4 w-4" />
                            }
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
