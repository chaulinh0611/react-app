import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import BoardList from './BoardList';
import { CreateListButton } from './components/CreateListButton';
import { useListsByBoardId, useReorderLists } from '@/entities/list/model/useList';
import { useQueries } from '@tanstack/react-query';
import type { ReorderListsPayload } from '@/entities/list/model/list.type';
import type { List } from '@/entities/list/model/list.type';
import { useReorderCard, useMoveCardToAnotherList } from '@/entities/card/model/useCard';
import { CardApi } from '@/entities/card/api/card.api';

export default function BoardLayout({ boardId }: { boardId: string }) {
    // fetch list
    const { data: resList = [], isLoading } = useListsByBoardId(boardId);

    const lists = resList.filter((list: List) => !list.isArchived);

    const cardQueries = useQueries({
        queries: lists.map((list: List) => ({
            queryKey: ['cards', list.id],
            queryFn: async () => {
                const res = await CardApi.getCardsOnList({ listId: list.id });
                const payload = Array.isArray(res) ? res : res?.data;
                const data = Array.isArray(payload)
                    ? payload
                    : Array.isArray((payload as any)?.data)
                      ? (payload as any).data
                      : [];
                const activeCards = data.filter((card: any) => !card.isArchived);
                return { listId: list.id, cards: activeCards };
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
            if (!destination) return;

            const sourceList = boardLists.find((l) => l.id === source.droppableId);
            const destList = boardLists.find((l) => l.id === destination.droppableId);
            if (!sourceList || !destList) return;

            const getPosition = (cards: any[], index: number) => ({
                beforeId: index > 0 ? cards[index - 1].id : null,
                afterId: index < cards.length - 1 ? cards[index + 1].id : null,
            });

            if (source.droppableId === destination.droppableId) {
                const newCards = [...sourceList.items];
                const [removed] = newCards.splice(source.index, 1);
                newCards.splice(destination.index, 0, removed);

                setBoardLists((prev) =>
                    prev.map((l) => (l.id === sourceList.id ? { ...l, items: newCards } : l)),
                );

                const pos = getPosition(newCards, destination.index);

                reorderCard({
                    cardId: draggableId,
                    listId: destList.id,
                    ...pos,
                });
            } else {
                const sourceCards = [...sourceList.items];
                const destCards = [...destList.items];

                const [removed] = sourceCards.splice(source.index, 1);
                destCards.splice(destination.index, 0, {
                    ...removed,
                    listId: destList.id,
                });

                setBoardLists((prev) =>
                    prev.map((l) => {
                        if (l.id === sourceList.id) return { ...l, items: sourceCards };
                        if (l.id === destList.id) return { ...l, items: destCards };
                        return l;
                    }),
                );

                const pos = getPosition(destCards, destination.index);

                moveCardToAnotherList({
                    cardId: draggableId,
                    listId: destList.id,
                    ...pos,
                });
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
