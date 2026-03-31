import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Board } from '@/entities/board/model/board.type';

interface Props {
    boards: Board[];
}

export function RecentlyViewedSection({ boards }: Props) {
    if (boards.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-gray-500" />
                <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900/80">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {boards.map((board) => (
                    <Link
                        key={board.id}
                        to={`/board/${board.id}`}
                        className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                        style={{ height: 80 }}
                    >
                        {board.backgroundPath ? (
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${board.backgroundPath})` }}
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-500 to-slate-700" />
                        )}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                        <div className="absolute inset-0 p-2 flex flex-col justify-end">
                            <p className="text-white text-xs font-semibold truncate leading-tight">{board.title}</p>
                            {board.workspace?.title && (
                                <p className="text-white/60 text-[10px] truncate">{board.workspace.title}</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
