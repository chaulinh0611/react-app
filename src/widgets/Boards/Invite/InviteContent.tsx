import { PopoverHeader, PopoverTitle } from '@/shared/ui/popover';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Dot, Link } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
    useGetBoardMembers,
    useInviteMemberByEmail,
    useInviteMemberByLink,
    useRevokeLink,
} from '@/entities/board/model/useBoard';
import { useState } from 'react';
import { toast } from 'sonner';
import { validateHandle } from '@/shared/lib/validate_handle';

const Role = {
    board_admin: 'Board Admin',
    board_member: 'Board Member',
};

export const InvitePopover = () => {
    // Get members data and action
    const { boardId } = useParams();
    const { data: BoardMembers } = useGetBoardMembers(boardId as string);
    const { mutate: inviteByEmail } = useInviteMemberByEmail();
    const { mutate: revokeLink } = useRevokeLink();
    const { mutate: generateShareLink } = useInviteMemberByLink();
    const [email, setEmail] = useState('');
    console.log(BoardMembers);
    function handleInviteEmail() {
        inviteByEmail(
            { boardId: boardId as string, email },
            {
                onError: (error) => {
                    return toast.error(validateHandle(error) || 'Something went wrong', {
                        position: 'top-center',
                    });
                },
                onSuccess: () => {
                    toast.success('Invite sent successfully', { position: 'top-center' });
                    setEmail('');
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
                <div className="mt-4 overflow-y-auto max-h-[200px]">
                    {BoardMembers?.map((member: any) => (
                        <div key={member.id} className="flex flex-row items-center gap-2 mb-2">
                            <Avatar className="w-7 h-7 border border-gray-600">
                                <AvatarImage src={member.avatarUrl} />
                                <AvatarFallback>{member.fullName}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <p>{member.fullName}</p>
                                <div className="flex flex-row items-center gap-2">
                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                    <Dot className="w-2 h-2 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">
                                        {Role[member.role as keyof typeof Role]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
