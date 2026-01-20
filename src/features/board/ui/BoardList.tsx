import { Draggable, Droppable } from '@hello-pangea/dnd';
import ListCard from './ListCard';
import { useCardsByListId } from '@/entities/card/models/card.selector';
import { useCardStore } from '@/entities/card/models/card.store';
import { useEffect } from 'react';
export default function BoardList({list, index} : any ) {
    const cards = useCardsByListId(list.id);
    const { getAllListCards } = useCardStore();

    useEffect(() => {
        getAllListCards(list.id);
    }, [list.id, getAllListCards]);

    return (
        <Draggable draggableId={list.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 rounded-md p-4 min-w-[250px] "
                >
                    <h2 className="font-semibold mb-4">{list.title}</h2>
                    <Droppable droppableId={list.id} type="CARD">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-2 min-h-[50px]"
                            >
                                {cards.map((card: any, index: number) => (
                                    <ListCard key={card.id} card={card} index={index} />

                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
}
