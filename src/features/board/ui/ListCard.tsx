import { Card, CardContent } from '@/shared/ui/card';
import type { Card as CardType } from '@/entities/card/model/type';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

interface ListCardProps {
    card: CardType;
    isDragging?: boolean;
}

export default function ListCard({ card, isDragging }: ListCardProps) {
    return (
        <>
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

                    {card.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {card.description}
                        </p>
                    )}

                    {(card.cardMembers?.length || 0) > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center -space-x-2">
                                {card.cardMembers?.slice(0, 3).map((member) => (
                                    <Avatar
                                        key={member.id}
                                        className="w-6 h-6 border-2 border-white ring-1 ring-gray-100"
                                    >
                                        <AvatarImage src={member.user.avatarUrl || undefined} />
                                        <AvatarFallback className="text-[10px]">
                                            {member.user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                                {(card.cardMembers?.length || 0) > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-medium text-gray-600 ring-1 ring-gray-100">
                                        +{(card.cardMembers?.length || 0) - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* TODO: Thêm CardDialog khi có component */}
        </>
    );
}
