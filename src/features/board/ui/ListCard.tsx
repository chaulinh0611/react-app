import { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import type { Card as CardType } from '@/entities/card/model/card.type';
// import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
// import { useBoardStore } from '@/shared/stores/useBoardStore';
import { CardDialog } from './components/CardDialog.tsx';
// import type { Card as CardType } from '@/shared/lib/types';

interface ListCardProps {
    card: CardType;
    isDragging?: boolean;
}

export default function ListCard({ card, isDragging }: ListCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <>
            <Card
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                    isDragging ? 'shadow-lg rotate-1' : ''
                }`}
                onClick={() => setIsDialogOpen(true)}
            >
                <CardContent>
                    {card.backgroundUrl && (
                        <div
                            className="w-full h-24 mb-2 rounded-md bg-cover bg-center"
                            style={{ backgroundImage: `url(${card.backgroundUrl})` }}
                        />
                    )}
                    <h4 className="text-sm font-medium text-gray-900 mb-2 overflow-hidden text-ellipsis ">
                        {card.title}
                    </h4>

                    {card.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {card.description}
                        </p>
                    )}

                    {/* {assignedUsers.length > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center -space-x-1">
                                {assignedUsers.slice(0, 3).map((user) => (
                                    <Avatar key={user.id} className="w-5 h-5 border border-white">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="text-xs">
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                                {assignedUsers.length > 3 && (
                                    <div className="w-5 h-5 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                        +{assignedUsers.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    )} */}
                </CardContent>
            </Card>

            <CardDialog card={card} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </>
    );
}
