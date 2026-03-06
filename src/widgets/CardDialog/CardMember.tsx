import { useGetMembersOnCard, useRemoveMemberFromCard } from '@/entities/card/model/useCard';
import { AvatarGroup } from '@/shared/ui/avatar';
import { Label } from '@/shared/ui/label';
import { CardMemberList } from './CardMemberList';

export default function CardMember({ cardId }: { cardId: string }) {
    const { data: members } = useGetMembersOnCard(cardId);
    const { mutate: removeMember } = useRemoveMemberFromCard();

    function handleRemoveMember(memberId: string) {
        removeMember({ cardId, memberId });
    }

    if (members?.length > 0) {
        return (
            <div className="mt-3">
                <Label className="my-3">Members</Label>
                <div className="flex gap-2">
                    <AvatarGroup>
                        {members.map((member: any) => (
                            <CardMemberList
                                key={member.userId}
                                member={member}
                                handleRemoveMember={handleRemoveMember}
                            />
                        ))}
                    </AvatarGroup>
                </div>
            </div>
        );
    }
    return null;
}
