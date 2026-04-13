import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePromiseToast } from '@/shared/ui/animated-toast';
import {
    useWorkspaceByIdQuery,
    useUpdateWorkspaceMutation,
    useArchiveWorkspaceMutation,
    useUnarchiveWorkspaceMutation,
    useDeleteWorkspaceMutation,
} from '@/entities/workspace/model/workspace.queries';
import { useUnarchiveBoard, useGetArchivedBoards } from '@/entities/board/model/useBoard';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

export default function WorkspaceSettingsPage() {
    const promiseToast = usePromiseToast();
    const { addToast, removeToast } = useAnimatedToast();
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const navigate = useNavigate();
    const { data: currentWorkspace, isLoading } = useWorkspaceByIdQuery(workspaceId ?? '');
    const updateWorkspace = useUpdateWorkspaceMutation();
    const archiveWorkspace = useArchiveWorkspaceMutation();
    const unarchiveBoard = useUnarchiveBoard();
    const workspaceArchivedBoards =
        useGetArchivedBoards().data?.filter((b) => b.workspace?.id === workspaceId) || [];

    const unarchiveWorkspace = useUnarchiveWorkspaceMutation();
    const deleteWorkspace = useDeleteWorkspaceMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!currentWorkspace) return;
        setTitle(currentWorkspace.title || '');
        setDescription(currentWorkspace.description || '');
    }, [currentWorkspace]);

    /* ================= UPDATE ================= */
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workspaceId) return;

        await promiseToast({
            promise: updateWorkspace.mutateAsync({
                id: workspaceId,
                payload: { title, description },
            }),
            loading: 'Updating workspace...',
            success: 'Workspace updated successfully',
            error: 'Failed to update workspace',
        });
    };

    /* ================= ARCHIVE ================= */
    const handleArchiveToggle = async () => {
        if (!workspaceId || !currentWorkspace) return;

        await promiseToast({
            promise: currentWorkspace.isArchived
                ? unarchiveWorkspace.mutateAsync(workspaceId)
                : archiveWorkspace.mutateAsync(workspaceId),
            loading: 'Updating workspace...',
            success: currentWorkspace.isArchived ? 'Workspace reopened' : 'Workspace archived',
            error: 'Action failed',
        });

        navigate('/');
    };

    /* ================= DELETE ================= */
    const handleDelete = async () => {
        if (!workspaceId) return;

        const id = addToast({
            title: 'Confirm delete',
            message: 'Are you sure you want to delete this workspace?',
            type: 'warning',
            duration: 0,
            action: {
                label: 'Delete',
                onClick: async () => {
                    removeToast(id);

                    await promiseToast({
                        promise: deleteWorkspace.mutateAsync(workspaceId),
                        loading: 'Deleting workspace...',
                        success: 'Workspace deleted',
                        error: 'Delete failed',
                    });

                    navigate('/');
                },
            },
            secondaryAction: {
                label: 'Cancel',
                onClick: () => {
                    removeToast(id);
                },
            },
        });
    };

    /* ================= RENDER ================= */
    if (isLoading && !currentWorkspace) {
        return <div className="p-6">Loading workspace...</div>;
    }

    if (!currentWorkspace) {
        return <div className="p-6">Workspace not found</div>;
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 flex justify-center py-10">
            <div className="w-full max-w-3xl space-y-8">
                {/* HEADER */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow">
                        {title?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">{currentWorkspace.title}</h1>
                        <p className="text-sm text-gray-500">Manage workspace settings</p>
                    </div>
                </div>

                {/* GENERAL */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
                    <h2 className="text-lg font-semibold text-gray-800">General Information</h2>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-500">Workspace Title</label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">Description</label>

                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-md"
                        >
                            Save Changes
                        </button>
                    </form>
                </section>

                {/* ARCHIVED BOARDS */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Archived Boards</h2>

                    {workspaceArchivedBoards.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No archived boards in this workspace.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {workspaceArchivedBoards.map((board) => (
                                <div
                                    key={board.id}
                                    className="flex items-center justify-between border rounded-md px-4 py-2"
                                >
                                    <div>
                                        <p className="font-medium">{board.title}</p>
                                        <p className="text-xs text-gray-500">
                                            Created:{' '}
                                            {new Date(board.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={async () => {
                                            await promiseToast({
                                                promise: unarchiveBoard.mutateAsync({
                                                    boardId: board.id,
                                                    workspaceId: board.workspace.id,
                                                }),
                                                loading: 'Restoring board...',
                                                success: 'Board restored',
                                                error: 'Failed to restore board',
                                            });
                                        }}
                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                                    >
                                        Unarchive
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                {/* STATUS */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Workspace Status</h2>

                    <p className="text-sm text-gray-600 flex items-center gap-2">
                        Current status:
                        <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                                currentWorkspace.isArchived
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-green-100 text-green-700'
                            }`}
                        >
                            {currentWorkspace.isArchived ? 'Archived' : 'Active'}
                        </span>
                    </p>

                    <button
                        onClick={handleArchiveToggle}
                        className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white transition"
                    >
                        {currentWorkspace.isArchived ? 'Reopen Workspace' : 'Archive Workspace'}
                    </button>
                </section>

                {/* DELETE */}
                <section className="bg-red-50 rounded-xl border border-red-300 p-6 space-y-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>

                    <p className="text-sm text-red-500">
                        Deleting a workspace is permanent and cannot be undone.
                    </p>

                    <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-2 rounded-md"
                    >
                        Delete Workspace
                    </button>
                </section>
            </div>
        </div>
    );
}
