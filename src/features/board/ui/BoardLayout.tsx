import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import BoardList from './BoardList';
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
                listId: draggableId
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
                const payload : ReorderCardPayload = {
                    listId,
                    beforeId: beforeId || null,
                    afterId: afterId || null,
                    cardId: draggableId
                };
                useCardStore.getState().reorderCards(payload);
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
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="board" direction="horizontal" type="LIST">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex items-start gap-4 p-4 overflow-x-auto"
                        >
                            {lists.map((list, index) => (
                                <BoardList key={list.id} list={list} index={index} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
