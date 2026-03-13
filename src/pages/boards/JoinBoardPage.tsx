import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useJoinBoard } from '@/entities/board/model/useBoard';
import { Card } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';

export default function JoinBoardPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { data, isLoading } = useJoinBoard(token as string);
    const navigate = useNavigate();
    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (data) {
        return <Navigate to={`/board/${data.data.boardId}`} />;
    }
    return (
        <Card className="w-[700px] px-10 mx-auto mt-30 flex flex-col items-center justify-center">
            <img src="@/../error.svg" className="w-1/5" alt="error" />
            <Label className="text-2xl font-bold">Link invitation is invalid or expired</Label>
            <p className="text-muted-foreground text-center">
                The invitation link may have expired or has already been used. Please ask the board
                owner to send a new invitation.
            </p>
            <div className="flex gap-2 mt-4">
                <Button onClick={() => navigate('/dashboard')} variant={'outline'}>
                    <ArrowLeft />
                    Go to Dashboard
                </Button>
                <Button>Request owner</Button>
            </div>
        </Card>
    );
}
