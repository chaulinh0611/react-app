import BoardLayout from "@/features/board/ui/BoardLayout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useBoardById } from "@/entities/board/model/board.selector";
import { useBoardStore } from "@/entities/board/model/board.store";

export default function BoardPage() {
    const { boardId } = useParams();
    const board = useBoardById(boardId as string);
    const { fetchBoardById } = useBoardStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (boardId && !board) {
            setIsLoading(true);
            fetchBoardById(boardId).finally(() => setIsLoading(false));
        }
    }, [boardId, board, fetchBoardById]);

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex flex-col flex-1">
                <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    Loading...
                                </div>
                            ) : (
                                board?.title || 'Board not found'
                            )}
                        </h1>
                    </div>
                </header>

                <main className="flex-1 p-8 space-y-6 bg-[#F1F5F9]">
                    <div className="flex justify-between items-start mb-8">
                        <BoardLayout boardId={boardId as string} />
                    </div>
                </main>
            </div>
        </div>
    );
}
