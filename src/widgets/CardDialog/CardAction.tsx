import { Button } from '@/shared/ui/button';
import { UserPlus, Tag, ListTodo, File } from 'lucide-react';
import { useCreateChecklist } from '@/entities/checklist/model/useChecklist';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
} from '@/shared/ui/popover';
import { Input } from '@/shared/ui/input';
import { useState } from 'react';
import { useAddMemberToCard, useGetUnassignedMembers } from '@/entities/card/model/useCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Label } from '@/shared/ui/label';

export default function CardAction({ cardId }: { cardId: string }) {
    const { mutate: createChecklist } = useCreateChecklist();
    const [title, setTitle] = useState('');
    const { mutate: addMemberToCard } = useAddMemberToCard();
    const { data: unassignedMembers } = useGetUnassignedMembers(cardId);

    function handleAddChecklist() {
        createChecklist(
            { title, cardId },
            {
                onSuccess: () => {
                    setTitle('');
                },
            },
        );
    }

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
        <div className="flex gap-3">
            {/* Members */}
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

            {/* Label */}
            <Button variant={'outline'} className="text-[12px] rounded-sm ">
                <Tag />
                Label
            </Button>

            {/* Checklist */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={'outline'} className="text-[12px] rounded-sm ">
                        <ListTodo />
                        Checklist
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex gap-2">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter checklist title..."
                            onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                        />
                        <Button onClick={handleAddChecklist}>Add</Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Attachment */}
            <Button variant={'outline'} className="text-[12px] rounded-sm ">
                <File />
                Attachment
            </Button>
        </div>
    );
}
