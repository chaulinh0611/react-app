import { Button } from '@/shared/ui/button';
import { Filter, Users, Tag } from 'lucide-react';
import { useCardStore } from '@/entities/card/model/card.store';

interface Props { boardId: string; }

export const BoardCardFilter = ({ boardId }: Props) => {
    const { getCardsInBoard } = useCardStore();

    const handleFilter = (memberId?: string) => {
        getCardsInBoard(boardId, { memberIds: memberId ? [memberId] : [] });
    };

    return (
        <div className="flex items-center gap-2 py-2 px-4 bg-background/50 border-b">
            <Button variant="outline" size="sm" className="h-8 gap-2">
                <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={() => handleFilter()}>
                <Users className="h-3.5 w-3.5" /> All Members
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-2">
                <Tag className="h-3.5 w-3.5" /> Labels
            </Button>
        </div>
    );
};