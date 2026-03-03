import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import BoardList from './BoardList';
import { CreateListButton } from './components/CreateListButton';
import { useListsByBoardId, useReorderLists } from '@/entities/list/model/useList';
import { useQueryClient } from '@tanstack/react-query';
import type { ReorderListsPayload } from '@/entities/list/model/list.type';
import type { List } from '@/entities/list/model/list.type';

export default function BoardLayout({ boardId }: { boardId: string }) {
    const { data: lists = [], isLoading } = useListsByBoardId(boardId);
    const { mutate: reorderLists } = useReorderLists(boardId);
    const queryClient = useQueryClient();

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index)
            return;

        if (type === 'LIST') {
            // Optimistic update
            const currentLists = queryClient.getQueryData<any>(['lists', boardId]);
            const updatedLists: List[] = [...(currentLists?.data ?? lists)];
            const [removed] = updatedLists.splice(source.index, 1);
            updatedLists.splice(destination.index, 0, removed);

            queryClient.setQueryData(['lists', boardId], (old: any) => ({
                ...old,
                data: updatedLists,
            }));

            const beforeId = updatedLists[destination.index - 1]?.id ?? null;
            const afterId = updatedLists[destination.index + 1]?.id ?? null;

            const payload: ReorderListsPayload = {
                boardId,
                beforeId,
                afterId,
                listId: draggableId,
            };

            reorderLists(payload, {
                onError: () => {
                    // Roll back on error
                    queryClient.setQueryData(['lists', boardId], currentLists);
                },
            });
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
                                {lists.map((list: List, index: number) => (
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
