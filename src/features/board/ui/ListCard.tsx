import { Card, CardContent } from '@/shared/ui/card';
import type { Card as CardType } from '@/entities/card/model/type';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import CardDialog from '@/widgets/CardDialog/CardDialog';
import { useEffect, useState } from 'react';
import { TextAlignJustify } from 'lucide-react';
import { useGetMembersOnCard } from '@/entities/card/model/useCard';
import type { User } from '@/entities/board/model/user.type';

interface ListCardProps {
    card: CardType;
    isDragging?: boolean;
}

export default function ListCard({ card, isDragging }: ListCardProps) {
    const [open, setOpen] = useState(false);
    const { data: cardMembers } = useGetMembersOnCard(card.id);
    console.log('cardMembers', cardMembers);
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
            }}
        >
            <DialogTrigger asChild>
                <Card
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                        isDragging ? 'shadow-lg rotate-1' : ''
                    }`}
                >
                    <CardContent>
                        {card.backgroundUrl && (
                            <div
                                className="w-full h-24 mb-2 rounded-md bg-cover bg-center"
                                style={{ backgroundImage: `url(${card.backgroundUrl})` }}
                            />
                        )}
                        <h4 className="text-sm font-medium text-gray-900 mb-2 overflow-hidden text-ellipsis">
                            {card.title}
                        </h4>

                        {/* Card Labels */}

                        {/* Card Icon */}
                        <div className="flex gap-2 items-center justify-between">
                            {card.description && <TextAlignJustify className="h-3" />}

                            {(cardMembers?.length || 0) > 0 && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center -space-x-2">
                                        {cardMembers?.slice(0, 3).map((member: any) => (
                                            <Avatar
                                                key={member.userId}
                                                className="w-6 h-6 border-2 border-white ring-1 ring-gray-100"
                                            >
                                                <AvatarImage src={member.avatarUrl || undefined} />
                                                <AvatarFallback className="text-[10px]">
                                                    {member.fullName.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {(cardMembers?.length || 0) > 3 && (
                                            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-medium text-gray-600 ring-1 ring-gray-100">
                                                +{(cardMembers?.length || 0) - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="rounded-sm min-w-5xl p-0! max-h-[min(700px,80vh)] flex flex-col overflow-hidden">
                <CardDialog card={card} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
