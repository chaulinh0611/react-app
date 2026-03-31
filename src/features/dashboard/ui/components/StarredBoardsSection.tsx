import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Board } from '@/entities/board/model/board.type';
import { useToggleStarBoard } from '@/entities/board/model/useBoard';

interface Props {
    boards: Board[];
}

function BoardMini({ board, isStarred }: { board: Board; isStarred: boolean }) {
    const toggleStar = useToggleStarBoard();

    return (
        <div className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer" style={{ height: 80 }}>
            {/* Background */}
            {board.backgroundPath ? (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${board.backgroundPath})` }}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

            {/* Star button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleStar.mutate({ boardId: board.id });
                }}
                className={`absolute top-1.5 right-1.5 z-20 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                    isStarred ? 'opacity-100 text-yellow-400' : 'text-white/70 hover:text-yellow-300'
                }`}
            >
                <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-yellow-400' : ''}`} />
            </button>

            <Link to={`/board/${board.id}`} className="absolute inset-0 z-10 p-2 flex flex-col justify-end">
                <p className="text-white text-xs font-semibold truncate leading-tight">{board.title}</p>
                {board.workspace?.title && (
                    <p className="text-white/60 text-[10px] truncate">{board.workspace.title}</p>
                )}
            </Link>
        </div>
    );
}

export function StarredBoardsSection({ boards }: Props) {
    if (boards.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900/80">Starred Boards</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {boards.map((board) => (
                    <BoardMini key={board.id} board={board} isStarred={true} />
                ))}
            </div>
        </div>
    );
}
