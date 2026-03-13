import { useEffect, useState } from 'react';
import { useCardStore } from '@/entities/card/model/card.store';
import type { Card } from '@/entities/card/model/card.type';
import { UserCheck } from 'lucide-react';

export const AssignedCardsWidget = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const { getAssignedCards } = useCardStore();

    useEffect(() => {
        getAssignedCards({}).then(setCards);
    }, [getAssignedCards]);

    return (
        <div className="p-4 bg-card rounded-lg border shadow-sm">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
                <UserCheck className="w-4 h-4 text-primary" /> Assigned to Me
            </h3>
            <div className="space-y-2">
                {cards.length === 0 ? (
                    <p className="text-sm text-muted-foreground">You have no assigned tasks.</p>
                ) : (
                    cards.map((c) => (
                        <div key={c.id} className="text-sm p-3 bg-muted rounded shadow-sm hover:bg-accent cursor-pointer transition-colors border">
                            <p className="font-medium">{c.title}</p>
                            {c.description && (
                                <p className="text-xs text-muted-foreground mt-1 truncate">{c.description}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};