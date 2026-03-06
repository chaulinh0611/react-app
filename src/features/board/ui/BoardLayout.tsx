import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import BoardList from './BoardList';
import { CreateListButton } from './components/CreateListButton';
import { useListsByBoardId, useReorderLists } from '@/entities/list/model/useList';
import { useQueries } from '@tanstack/react-query';
import type { ReorderListsPayload } from '@/entities/list/model/list.type';
import type { List } from '@/entities/list/model/list.type';
import type { MoveCardToAnotherListPayload, ReorderCardPayload } from '@/entities/card/model/type';
import { useReorderCard, useMoveCardToAnotherList } from '@/entities/card/model/useCard';
import { CardApi } from '@/entities/card/api/card.api';

export default function BoardLayout({ boardId }: { boardId: string }) {
    // fetch list
    const { data: lists = [], isLoading } = useListsByBoardId(boardId);

    const cardQueries = useQueries({
        queries: lists.map((list: List) => ({
            queryKey: ['cards', list.id],
            queryFn: async () => {
                const res = await CardApi.getCardsOnList({ listId: list.id });
                const data = Array.isArray(res) ? res : (res?.data ?? []);
                return { listId: list.id, cards: data };
            },
            enabled: !!list.id,
        })),
    });

    const [boardLists, setBoardLists] = useState<any[]>([]);

    const { mutate: reorderLists } = useReorderLists(boardId);
    const { mutate: reorderCard } = useReorderCard();
    const { mutate: moveCardToAnotherList } = useMoveCardToAnotherList();

    const combinedData = useMemo(() => {
        if (!lists) return [];
        return lists.map((list: List) => {
            const query = cardQueries.find((q: any) => q.data?.listId === list.id);
            const cards = (query?.data as any)?.cards || [];
            return {
                ...list,
                items: [...cards],
            };
        });
    }, [lists, cardQueries]);

    useEffect(() => {
        setBoardLists(combinedData);
    }, [JSON.stringify(combinedData)]);

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index)
            return;

        if (type === 'LIST') {
            const newLists = [...boardLists];
            const [removed] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, removed);

            setBoardLists(newLists);

            const beforeId = destination.index > 0 ? newLists[destination.index - 1].id : null;
            const afterId =
                destination.index < newLists.length - 1 ? newLists[destination.index + 1].id : null;

            const payload: ReorderListsPayload = {
                boardId,
                listId: draggableId,
                beforeId,
                afterId,
            };

            reorderLists(payload);
            return;
        }

        if (type === 'CARD') {
            const sourceList = boardLists.find((l) => l.id === source.droppableId);
            const destList = boardLists.find((l) => l.id === destination.droppableId);

            if (!sourceList || !destList) return;

            if (source.droppableId === destination.droppableId) {
                // Move within the same list
                const newCards = [...sourceList.items];
                const [removed] = newCards.splice(source.index, 1);
                newCards.splice(destination.index, 0, removed);

                const newLists = boardLists.map((l) => {
                    if (l.id === sourceList.id) {
                        return { ...l, items: newCards };
                    }
                    return l;
                });

                setBoardLists(newLists);

                const beforeId = destination.index > 0 ? newCards[destination.index - 1].id : null;
                const afterId =
                    destination.index < newCards.length - 1
                        ? newCards[destination.index + 1].id
                        : null;

                const payload: ReorderCardPayload = {
                    cardId: draggableId,
                    targetListId: destList.id,
                    beforeId,
                    afterId,
                };

                reorderCard(payload);
            } else {
                // Move to another list
                const sourceCards = [...sourceList.items];
                const destCards = [...destList.items];
                const [removed] = sourceCards.splice(source.index, 1);

                destCards.splice(destination.index, 0, { ...removed, listId: destList.id });

                const newLists = boardLists.map((l) => {
                    if (l.id === sourceList.id) {
                        return { ...l, items: sourceCards };
                    }
                    if (l.id === destList.id) {
                        return { ...l, items: destCards };
                    }
                    return l;
                });

                setBoardLists(newLists);

                const beforeId = destination.index > 0 ? destCards[destination.index - 1].id : null;
                const afterId =
                    destination.index < destCards.length - 1
                        ? destCards[destination.index + 1].id
                        : null;

                const payload: MoveCardToAnotherListPayload = {
                    cardId: draggableId,
                    targetListId: destList.id,
                    beforeId,
                    afterId,
                };

                moveCardToAnotherList(payload);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-white/70 text-sm">Đang tải...</p>
            </div>
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="LIST">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex gap-4 p-4 h-full overflow-x-auto"
                    >
                        {boardLists.map((list: any, index: number) => (
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
                                            cards={list.items}
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
    );
}
