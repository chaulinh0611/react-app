import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useCardsByListId } from '@/entities/card/model/card.selector';
import { useCardStore } from '@/entities/card/model/card.store';
import type { List } from '@/entities/list/model/list.type';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

import { Input } from '@/shared/ui/input';
import ListCard from './ListCard';
import { ListDropdown } from './components/ListDropdown';

interface BoardListProps {
    list: List;
    dragHandleProps?: any;
    isDragging?: boolean;
}

export default function BoardList({ list, dragHandleProps, isDragging }: BoardListProps) {
    const cards = useCardsByListId(list.id);
    const { getAllListCards, createCard } = useCardStore();
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(list.title);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');

    useEffect(() => {
        getAllListCards(list.id);
    }, [list.id, getAllListCards]);

    const handleAddCard = () => {
        if (newCardTitle.trim()) {
            createCard({ listId: list.id, title: newCardTitle.trim() });
            setNewCardTitle('');
            setIsAddingCard(false);
        }
    };

    const handleCancelAddCard = () => {
        setNewCardTitle('');
        setIsAddingCard(false);
    };

    return (
        <Card className={`w-80 bg-gray-50 ${isDragging ? 'shadow-lg' : ''}`}>
            <CardHeader className="px-4!" {...dragHandleProps}>
                <div className="flex items-center justify-between">
                    {isEditing ? (
                        <Input
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                            className="text-sm font-semibold bg-white"
                            autoFocus
                        />
                    ) : (
                        <h3
                            className="text-sm font-semibold cursor-pointer hover:bg-gray-200 rounded  py-1"
                            onClick={() => setIsEditing(true)}
                        >
                            {list.title}
                        </h3>
                    )}
                    <ListDropdown setIsEditing={setIsEditing} listId={list.id} />
                </div>
            </CardHeader>

            <CardContent className="pt-0 px-4!">
                <Droppable droppableId={list.id} type="CARD">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`space-y-2 min-h-2 rounded-[5px] ${
                                snapshot.isDraggingOver ? 'bg-blue-50' : ''
                            }`}
                        >
                            {cards.map((card, index) => (
                                <Draggable key={card.id} draggableId={card.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <ListCard
                                                card={card}
                                                isDragging={snapshot.isDragging}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}

                            {isAddingCard ? (
                                <div className="space-y-2">
                                    <Input
                                        value={newCardTitle}
                                        onChange={(e) => setNewCardTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddCard();
                                            if (e.key === 'Escape') handleCancelAddCard();
                                        }}
                                        placeholder="Enter card title..."
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={handleAddCard}>
                                            Add Card
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleCancelAddCard}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-gray-500 hover:text-gray-700"
                                    onClick={() => setIsAddingCard(true)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add a card
                                </Button>
                            )}
                        </div>
                    )}
                </Droppable>
            </CardContent>
        </Card>
    );
}
