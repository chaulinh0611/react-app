import { useSearchParams } from 'react-router-dom';
import { useJoinBoard } from '@/entities/board/model/useBoard';
import { useEffect } from 'react';

export default function JoinBoardPage() {
    const [searchParams] = useSearchParams();
    const { mutateAsync: joinBoard } = useJoinBoard();

    const boardId = searchParams.get('boardId');
    const token = searchParams.get('token');

    console.log(boardId, token);
    useEffect(() => {
        if (token) {
            joinBoard({ token });
        }
    }, [token]);
    return (
        <div>
            <h1>Join Board</h1>
        </div>
    );
}
