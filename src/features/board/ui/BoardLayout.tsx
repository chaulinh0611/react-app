import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import BoardList from './BoardList';
import { CreateListButton } from './CreateListButton';
import { useEffect } from 'react';
import { useListsByBoard } from '@/entities/list/models/list.selector';
import { useListStore } from '@/entities/list/models/list.store';
import type { ReorderListsPayload } from '@/entities/list/models/list.type';
import type { ReorderCardPayload } from '@/entities/card/models/card.type';
import { useCardStore } from '@/entities/card/models/card.store';

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
            const newLists = useListStore.getState().boardsLists[boardId];
            const [removed] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, removed);

            const beforeId = newLists[destination.index - 1];
            const afterId = newLists[destination.index + 1];

            const payload: ReorderListsPayload = {
                boardId,
                beforeId: beforeId || null,
                afterId: afterId || null,
                listId: draggableId,
            };

            useListStore.getState().reorderLists(payload);
        }

        if (type === 'CARD') {
            // Reorder in same list
            if (source.droppableId === destination.droppableId) {
                const listId = source.droppableId;
                const cardList = useCardStore.getState().listCards[listId] || [];
                const [removed] = cardList.splice(source.index, 1);
                cardList.splice(destination.index, 0, removed);

                const beforeId = cardList[destination.index - 1];
                const afterId = cardList[destination.index + 1];
                const payload: ReorderCardPayload = {
                    listId,
                    beforeId: beforeId || null,
                    afterId: afterId || null,
                    cardId: draggableId,
                };
                useCardStore.getState().reorderCards(payload);
            }
            else {
                console.log(destination, source);
                // Move to another list
                const destListId = destination.droppableId;
                const destCardList = useCardStore.getState().listCards[destListId] || [];
                const beforeId = destCardList[destination.index - 1];
                const afterId = destCardList[destination.index];
                const payload: ReorderCardPayload = {
                    listId: destListId,
                    beforeId: beforeId || null,
                    afterId: afterId || null,
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
