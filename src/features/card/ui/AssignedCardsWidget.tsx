import { useEffect, useState } from 'react';
import { useCardStore } from '@/entities/card/model/card.store';
import type { Card } from '@/entities/card/model/card.type';
import { UserCheck } from 'lucide-react';

export const AssignedCardsWidget = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const { getAssignedCards } = useCardStore();

    useEffect(() => {
        getAssignedCards({}).then(setCards); // SCRUM-163
    }, []);

    return (
        <div className="p-4 bg-card rounded-lg border">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
                <UserCheck className="w-4 h-4" /> Assigned to Me
            </h3>
            <div className="space-y-2">
                {cards.map(c => <div key={c.id} className="text-sm p-2 bg-muted rounded">{c.title}</div>)}
            </div>
        </div>
    );
};