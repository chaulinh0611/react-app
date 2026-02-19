import { useEffect, useState } from 'react';
import { useCardStore } from '@/entities/card/model/card.store';
import type { Card } from '@/entities/card/model/card.type';
import { Clock } from 'lucide-react';

export const DueSoonCardsWidget = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const { getCardsDueSoon } = useCardStore();

    useEffect(() => {
        getCardsDueSoon().then(setCards);
    }, []);

    return (
        <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <h3 className="flex items-center gap-2 font-semibold text-destructive mb-3">
                <Clock className="w-4 h-4" /> Due Soon
            </h3>
            <div className="space-y-2">
                {cards.map(c => (
                    <div key={c.id} className="text-sm p-2 bg-background border rounded flex justify-between">
                        <span>{c.title}</span>
                        <span className="text-xs text-muted-foreground">{new Date(c.dueDate!).toLocaleDateString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};