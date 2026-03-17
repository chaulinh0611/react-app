import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import BoardList from './BoardList';
import { CreateListButton } from './components/CreateListButton';
import { useEffect } from 'react';
import { useListsByBoard } from '@/entities/list/model/list.selector';
import { useListStore } from '@/entities/list/model/list.store';
import type { ReorderListsPayload } from '@/entities/list/model/list.type';
import type { ReorderCardPayload } from '@/entities/card/model/card.type';
import { useCardStore } from '@/entities/card/model/card.store';

export default function BoardLayout({ boardId }: { boardId: string }) {
    const onDragEnd = (result: any) => {
        const { destination, source, draggableId, type } = result;
        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type === 'LIST') {
            const currentLists = [...(useListStore.getState().boardsLists[boardId] || [])];
            
            // Calculate new position neighbors without mutating the original state
            const removed = currentLists[source.index];
            const remaining = currentLists.filter((_, i) => i !== source.index);
            const reordered = [
                ...remaining.slice(0, destination.index),
                removed,
                ...remaining.slice(destination.index)
            ];

            const beforeId = reordered[destination.index - 1] || null;
            const afterId = reordered[destination.index + 1] || null;

            const payload: ReorderListsPayload = {
                boardId,
                beforeId,
                afterId,
                listId: draggableId,
            };

            useListStore.getState().reorderLists(payload);
        }

        if (type === 'CARD') {
            // Reorder in same list
            if (source.droppableId === destination.droppableId) {
                const listId = source.droppableId;
                const currentCards = [...(useCardStore.getState().listCards[listId] || [])];
                
                const removed = currentCards[source.index];
                const remaining = currentCards.filter((_, i) => i !== source.index);
                const reordered = [
                    ...remaining.slice(0, destination.index),
                    removed,
                    ...remaining.slice(destination.index)
                ];

                const beforeId = reordered[destination.index - 1] || null;
                const afterId = reordered[destination.index + 1] || null;

                const payload: ReorderCardPayload = {
                    listId,
                    beforeId,
                    afterId,
                    cardId: draggableId,
                };
                useCardStore.getState().reorderCards(payload);
            } else {
                console.log('Moving to another list:', { destination, source });
                // Move to another list
                const destListId = destination.droppableId;
                const destCardList = [...(useCardStore.getState().listCards[destListId] || [])];

                const beforeId = destination.index > 0 ? destCardList[destination.index - 1] : null;
                const afterId =
                    destination.index < destCardList.length
                        ? destCardList[destination.index]
                        : null;

                const payload: ReorderCardPayload = {
                    listId: destListId,
                    beforeId,
                    afterId,
                    cardId: draggableId,
                };
                useCardStore.getState().moveCardToAnotherList(payload);
            }
        }
    };
    const lists = useListsByBoard(boardId);
    const { getListsByBoardId } = useListStore();

    useEffect(() => {
        getListsByBoardId(boardId);
    }, [boardId, getListsByBoardId]);
    return (
        <div>
            <div className="h-full overflow-hidden">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="board" direction="horizontal" type="LIST">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex gap-4 p-4 h-full overflow-x-auto"
                            >
                                {lists.map((list, index) => (
                                    <Draggable key={list.id} draggableId={list.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`shrink-0 ${
                                                    snapshot.isDragging ? 'rotate-2' : ''
                                                }`}
                                            >
                                                <BoardList
                                                    list={list}
                                                    dragHandleProps={provided.dragHandleProps}
                                                    isDragging={snapshot.isDragging}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}

                                <div className="shrink-0">
                                    <CreateListButton boardId={boardId} />
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}
