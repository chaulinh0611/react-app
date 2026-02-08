import BoardLayout from '@/features/board/ui/BoardLayout';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useBoardById } from '@/entities/board/model/board.selector';
import { useBoardStore } from '@/entities/board/model/board.store';

export default function BoardPage() {
    const { boardId } = useParams();
    const board = useBoardById(boardId as string);
    const { fetchBoardById } = useBoardStore();

    useEffect(() => {
        if (boardId && !board) {
            fetchBoardById(boardId);
        }
    }, [boardId, board, fetchBoardById]);

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex flex-col flex-1">
                <main className="flex-1 p-8 space-y-6">
                    <div className="flex justify-between items-start mb-8">
                        <BoardLayout boardId={boardId as string} />
                    </div>
                </main>
            </div>
        </div>
    );
}
