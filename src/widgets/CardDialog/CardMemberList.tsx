import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
} from '@/shared/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Trash, User } from 'lucide-react';

interface Props {
    member: any;
    handleRemoveMember: (memberId: string) => void;
}

export const CardMemberList = ({ member, handleRemoveMember }: Props) => {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant={'ghost'} size={'icon'} className="rounded-full">
                        <Avatar className="border border-gray-200">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>{member.fullName}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-2">
                        <Avatar className="border border-gray-200">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>{member.fullName}</AvatarFallback>
                        </Avatar>
                        <DropdownMenuLabel>{member.fullName}</DropdownMenuLabel>
                    </div>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <User />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRemoveMember(member.userId)}>
                            <Trash />
                            Remove a member
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
