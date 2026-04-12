import { UserPlus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '@/shared/ui/popover';
import { useAddMemberToCard, useGetUnassignedMembers } from '@/entities/card/model/useCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Label } from '@/shared/ui/label';

interface CardActionMembersProps {
    cardId: string;
}

export default function CardActionMembers({ cardId }: CardActionMembersProps) {
    const { mutate: addMemberToCard } = useAddMemberToCard();
    const { data: unassignedMembers } = useGetUnassignedMembers(cardId);

    function handleAssignMember(memberId: string) {
        addMemberToCard(
            { cardId, memberId },
            {
                onSuccess: () => {},
                onError(err) {
                    console.log(memberId);
                    console.error(err);
                },
            },
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={'outline'} className="text-[12px] rounded-sm ">
                    <UserPlus />
                    Assign Member
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
                <PopoverHeader className="mb-2">
                    <PopoverTitle>Assign Member</PopoverTitle>
                </PopoverHeader>
                <div className="flex flex-col gap-2">
                    {unassignedMembers?.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground">
                            No available members
                        </p>
                    )}
                    {unassignedMembers?.map((member: any) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-2 hover:bg-gray-200"
                            onClick={() => handleAssignMember(member.userId)}
                        >
                            <Avatar>
                                <AvatarImage src={member.avatarUrl} />
                                <AvatarFallback>{member.fullName}</AvatarFallback>
                            </Avatar>
                            <Label>{member.fullName}</Label>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
