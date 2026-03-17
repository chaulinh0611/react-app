import BoardLayout from '@/features/board/ui/BoardLayout';
import { useParams } from 'react-router-dom';
import { useGetBoardById } from '@/entities/board/model/useBoard';
import { PrivateBoardError } from '@/widgets/Boards/BoardError';

export default function BoardPage() {
    const { boardId } = useParams();
    const { data: board, error } = useGetBoardById(boardId as string);

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
