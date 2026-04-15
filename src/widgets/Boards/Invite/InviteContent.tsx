import { PopoverHeader, PopoverTitle } from '@/shared/ui/popover';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Dot, Link, Shield, User2, Eye } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
    useGetBoardMembers,
    useInviteMemberByEmail,
    useInviteMemberByLink,
    useRevokeLink,
    useUpdateBoardMemberRole,
} from '@/entities/board/model/useBoard';
import { useState } from 'react';
import { toast } from 'sonner';
import { validateHandle } from '@/shared/lib/validate_handle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const ROLE_OPTIONS = [
    { value: 'board_admin', label: 'Board Admin', icon: Shield },
    { value: 'board_member', label: 'Board Member', icon: User2 },
    { value: 'board_viewer', label: 'Board Viewer', icon: Eye },
];

const Role = ROLE_OPTIONS.reduce<Record<string, string>>((acc, role) => {
    acc[role.value] = role.label;
    return acc;
}, {});

export const InvitePopover = () => {
    // Get members data and action
    const { boardId } = useParams();
    const { data: BoardMembers } = useGetBoardMembers(boardId as string);
    const { mutate: inviteByEmail } = useInviteMemberByEmail();
    const { mutate: updateMemberRole } = useUpdateBoardMemberRole();
    const { mutate: revokeLink } = useRevokeLink();
    const { mutate: generateShareLink } = useInviteMemberByLink();
    const [email, setEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('board_member');

    function handleInviteEmail() {
        inviteByEmail(
            { boardId: boardId as string, email, role: inviteRole },
            {
                onError: (error) => {
                    return toast.error(String(validateHandle(error) || 'Something went wrong'), {
                        position: 'top-center',
                    });
                },
                onSuccess: () => {
                    toast.success('Invite sent successfully', { position: 'top-center' });
                    setEmail('');
                    setInviteRole('board_member');
                },
            },
        );
    }

    function handleChangeRole(userId: string, roleName: string) {
        updateMemberRole(
            { boardId: boardId as string, userId, roleName },
            {
                onError: (error) => {
                    toast.error(String(validateHandle(error) || 'Something went wrong'), {
                        position: 'top-center',
                    });
                },
                onSuccess: () => {
                    toast.success('Member role updated', { position: 'top-center' });
                },
            },
        );
    }

    function handleGenerateShareLink() {
        generateShareLink(
            { boardId: boardId as string },
            {
                onError: (error) => {
                    return toast.error(error.message || 'Something went wrong', {
                        position: 'top-center',
                    });
                },
                onSuccess: (data: any) => {
                    toast.success('Share link generated successfully', { position: 'top-center' });
                    navigator.clipboard.writeText(data.link);
                },
            },
        );
    }

    function handleRevokeLink() {
        revokeLink(
            { boardId: boardId as string },
            {
                onError: (error) => {
                    return toast.error(error.message || 'Something went wrong', {
                        position: 'top-center',
                    });
                },
                onSuccess: () => {
                    toast.success('Link revoked successfully', { position: 'top-center' });
                },
            },
        );
    }

    return (
        <div>
            <PopoverHeader className="flex flex-row justify-between items-center border-b pb-4 mb-4">
                <PopoverTitle className="flex font-bold">Share board</PopoverTitle>
            </PopoverHeader>
            <div className="flex flex-row items-center gap-2">
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="w-37.5">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                                <span className="flex items-center gap-2">
                                    <role.icon className="h-4 w-4" />
                                    {role.label}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={() => handleInviteEmail()}>Share</Button>
            </div>
            <div className="flex flex-row items-center gap-2 mt-4 text-sm">
                <Link />
                <div>
                    <p>Everyone with the link can join as member</p>
                    <div>
                        <Button
                            variant={'link'}
                            size={'xs'}
                            onClick={() => handleGenerateShareLink()}
                            className="text-blue-500 hover:text-blue-700 underline underline-offset-2"
                        >
                            Copy link
                        </Button>
                        <Button
                            variant={'link'}
                            size={'xs'}
                            onClick={() => handleRevokeLink()}
                            className="text-blue-500 hover:text-blue-700 underline underline-offset-2"
                        >
                            Delete link
                        </Button>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div>
                <p className="mt-4 text-sm font-bold">Board members</p>
                <div className="mt-4 max-h-50 overflow-y-auto">
                    {BoardMembers?.map((member: any) => (
                        <div key={member.id} className="mb-2 flex flex-row items-center gap-2">
                            <Avatar className="w-7 h-7 border border-gray-600">
                                <AvatarImage src={member.avatarUrl} />
                                <AvatarFallback>{member.fullName}</AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <p className="truncate">{member.fullName}</p>
                                <div className="flex flex-row items-center gap-2">
                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                    <Dot className="w-2 h-2 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">
                                        {Role[member.role as keyof typeof Role] || member.role}
                                    </p>
                                </div>
                            </div>
                            <div className="w-40 shrink-0">
                                <Select
                                    value={member.role || 'board_member'}
                                    onValueChange={(value) =>
                                        handleChangeRole(member.userId, value)
                                    }
                                >
                                    <SelectTrigger className="h-8 w-full text-xs">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLE_OPTIONS.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                <span className="flex items-center gap-2">
                                                    <role.icon className="h-4 w-4" />
                                                    {role.label}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
