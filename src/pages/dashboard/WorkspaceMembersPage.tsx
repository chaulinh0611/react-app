import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    useWorkspaceMembersQuery,
    useInviteWorkspaceMemberMutation,
    useRemoveWorkspaceMemberMutation,
    useCreateShareLinkMutation,
} from '@/entities/workspace/model/workspace.queries';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

export default function WorkspaceMembersPage() {
    const { workspaceId } = useParams<{ workspaceId: string }>();

    const {
        data: workspaceMembers = [],
        isLoading,
        error,
    } = useWorkspaceMembersQuery(workspaceId ?? '');
    const inviteWorkspaceMember = useInviteWorkspaceMemberMutation();
    const removeWorkspaceMember = useRemoveWorkspaceMemberMutation();
    const createShareLink = useCreateShareLinkMutation();

    const [email, setEmail] = useState('');
    const [shareLink, setShareLink] = useState('');
    const { addToast } = useAnimatedToast();

    const handleInvite = async () => {
        if (!email) {
            addToast({ message: 'Please enter email', type: 'warning' });
            return;
        }

        try {
            await inviteWorkspaceMember.mutateAsync({ workspaceId: workspaceId!, email });
            addToast({ message: 'Invitation sent!', type: 'success' });
            setEmail('');
        } catch {
            addToast({ message: 'Failed to send invitation', type: 'error' });
        }
    };

    const handleCreateLink = async () => {
        try {
            const link = await createShareLink.mutateAsync(workspaceId!);
            setShareLink(link);
            addToast({ message: 'Share link created', type: 'success' });
        } catch {
            addToast({ message: 'Failed to create share link', type: 'error' });
        }
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(shareLink);
        addToast({ message: 'Link copied!', type: 'success' });
        setShareLink(''); // quay lại nút ban đầu
    };

    const handleRemove = async (email: string) => {
        if (!workspaceId) return;

        if (window.confirm('Remove this member?')) {
            try {
                await removeWorkspaceMember.mutateAsync({ workspaceId, email });
                addToast({ message: 'Member removed', type: 'success' });
            } catch {
                addToast({ message: 'Failed to remove member', type: 'error' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center p-10">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border p-8 space-y-8">
                {/* HEADER */}
                <h1 className="text-2xl font-semibold text-gray-800">Workspace Members</h1>

                {/* INVITE EMAIL */}
                <div className="space-y-3">
                    <p className="font-medium text-gray-700">Invite by email</p>

                    <div className="flex gap-2">
                        <Input
                            className="flex-1"
                            placeholder="Enter user email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button onClick={handleInvite}>Invite</Button>
                    </div>
                </div>

                {/* SHARE LINK */}
                <div className="space-y-3">
                    <p className="font-medium text-gray-700">Invite by link</p>

                    {!shareLink ? (
                        <Button size="sm" variant="outline" onClick={handleCreateLink}>
                            Create Share Link
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Input value={shareLink} readOnly className="flex-1" />
                            <Button size="sm" onClick={copyLink}>
                                Copy
                            </Button>
                        </div>
                    )}
                </div>

                {error && <p className="text-red-500">{String(error)}</p>}
                {isLoading && <p className="text-gray-500 text-center py-4">Loading members...</p>}

                {/* MEMBERS */}
                <div className="space-y-3">
                    {workspaceMembers.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 transition"
                        >
                            {/* LEFT */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                                    {member.username[0]?.toUpperCase()}
                                </div>

                                <div>
                                    <p className="font-medium text-gray-800">{member.username}</p>
                                    <p className="text-xs text-gray-500">{member.email}</p>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center gap-4">
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                    {member.role.replace('workspace_', '')}
                                </span>

                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRemove(member.email)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}

                    {workspaceMembers.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No members found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
