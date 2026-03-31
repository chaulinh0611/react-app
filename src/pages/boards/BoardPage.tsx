import BoardLayout from '@/features/board/ui/BoardLayout';
import { useParams } from 'react-router-dom';
import { useGetBoardById } from '@/entities/board/model/useBoard';
import { PrivateBoardError } from '@/widgets/Boards/BoardError';
import { useEffect } from 'react';
import { useRecentBoards } from '@/entities/board/model/useRecentlyViewed';
import { useGetProfile } from '@/entities/auth/model/useAuthQueries';

export default function BoardPage() {
    const { boardId } = useParams();
    const { data: board, error } = useGetBoardById(boardId as string);
    const { data: profileRes } = useGetProfile();
    const userId = profileRes?.data?.id;
    const { addRecentBoard } = useRecentBoards(userId);

    useEffect(() => {
        if (boardId) addRecentBoard(boardId);
    }, [boardId, addRecentBoard]);

    if (error) {
        return <PrivateBoardError />;
    }

    return (
        <div
            className="h-full overflow-hidden bg-slate-100 bg-cover bg-center"
            style={
                board?.backgroundPath
                    ? {
                          backgroundImage: `url(${board.backgroundPath})`,
                      }
                    : undefined
            }
        >
            <BoardLayout boardId={boardId as string} />
        </div>
    );
}
