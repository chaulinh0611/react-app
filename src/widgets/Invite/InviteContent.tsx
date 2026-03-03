import { PopoverHeader, PopoverTitle } from '@/shared/ui/popover';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Dot, Link } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useBoardMembersStore } from '@/entities/board/model/board-members.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

const Role = {
    board_admin: 'Board Admin',
    board_member: 'Board Member',
};

export const InvitePopover = () => {
    // Get members data and action
    const { boardId } = useParams();
    const { fetchMembersByBoardId } = useBoardMembersStore();
    const BoardMembers = useBoardMembersStore((state) => state.BoardMembers[boardId as string]);
    useEffect(() => {
        if (boardId) {
            fetchMembersByBoardId(boardId);
        }
    }, [boardId, fetchMembersByBoardId]);

    return (
        <div>
            <PopoverHeader className="flex flex-row justify-between items-center border-b pb-4 mb-4">
                <PopoverTitle className="flex font-bold">Share board</PopoverTitle>
            </PopoverHeader>
            <div className="flex flex-row items-center gap-2">
                <Input placeholder="Email" />
                <Button>Share</Button>
            </div>
            <div className="flex flex-row items-center gap-2 mt-4 text-sm">
                <Link />
                <div>
                    <p>Everyone with the link can join as member</p>
                    <div>
                        <a
                            href=""
                            className="text-blue-500 hover:text-blue-700 underline underline-offset-2 mr-2"
                        >
                            Copy link
                        </a>
                        <a
                            href=""
                            className="text-blue-500 hover:text-blue-700 underline underline-offset-2"
                        >
                            Delete link
                        </a>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div>
                <p className="mt-4 text-sm font-bold">Board members</p>
                <div className="mt-4 overflow-y-auto h-auto">
                    {BoardMembers?.map((member) => (
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
