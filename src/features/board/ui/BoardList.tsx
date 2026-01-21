import { Draggable, Droppable } from '@hello-pangea/dnd';
import ListCard from './ListCard';
import { useCardsByListId } from '@/entities/card/models/card.selector';
import { useCardStore } from '@/entities/card/models/card.store';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import type { List } from '@/entities/list/models/list.type';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/shared/ui/dropdown-menu';
import { Card, CardHeader, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Edit, MoreVertical, Trash2, Plus } from 'lucide-react';

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
    console.log(cards);
    const handleAddCard = () => {
        if (newCardTitle.trim()) {
            createCard({ listId: list.id, title: newCardTitle.trim() });
            setNewCardTitle('');
            setIsAddingCard(false);
        }
    };

    useEffect(() => {
        getAllListCards(list.id);
    }, [list.id, getAllListCards]);


    return (
        <Card className={`w-96 rounded-[5px]! bg-[#E9EEF4]! ${isDragging ? 'shadow-lg' : ''}`}>
            <CardHeader className="pb-2" {...dragHandleProps}>
                <div className="flex items-center justify-between">
                    {isEditing ? (
                        <Input
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            className="text-sm font-semibold bg-white"
                            autoFocus
                        />
                    ) : (
                        <h3
                            className="text-sm font-semibold cursor-pointer hover:bg-gray-200 rounded px-2 py-1 -mx-2 -my-1"
                            onClick={() => setIsEditing(true)}
                        >
                            {list.title}
                        </h3>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
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
                                            if (e.key === 'Escape') {
                                                setNewCardTitle('');
                                                setIsAddingCard(false);
                                            }
                                        }}
                                        placeholder="Enter card title..."
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm">Add Card</Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setNewCardTitle('');
                                                setIsAddingCard(false);
                                            }}
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
