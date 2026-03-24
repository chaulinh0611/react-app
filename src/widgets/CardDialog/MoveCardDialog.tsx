import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Loader2 } from 'lucide-react';
import { useMoveCardToBoard } from '@/entities/card/model/useCard';
import { useGetAccessibleBoards } from '@/entities/board/model/useBoard';
import { useListsByBoardId } from '@/entities/list/model/useList';
import { toast } from 'sonner';

interface MoveCardDialogProps {
    cardId: string;
    currentBoardId: string;
    currentListId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MoveCardDialog({
    cardId,
    currentBoardId,
    currentListId,
    open,
    onOpenChange,
}: MoveCardDialogProps) {
    const [selectedBoardId, setSelectedBoardId] = useState<string>(currentBoardId);
    const [selectedListId, setSelectedListId] = useState<string>(currentListId);

    const { data: boardsData, isLoading: isLoadingBoards } = useGetAccessibleBoards();
    const { data: listsData = [], isLoading: isLoadingLists } = useListsByBoardId(selectedBoardId);
    const { mutate: moveCard, isPending: isMoving } = useMoveCardToBoard();

    const boards = useMemo(() => boardsData || [], [boardsData]);

    const handleBoardChange = (boardId: string) => {
        setSelectedBoardId(boardId);
        if (listsData && listsData.length > 0) {
            setSelectedListId(listsData[0].id);
        }
    };

    const handleMove = () => {
        if (!selectedBoardId || !selectedListId) {
            toast.error('Vui lòng chọn board và list đích.');
            return;
        }

        if (selectedBoardId === currentBoardId && selectedListId === currentListId) {
            toast.info('Thẻ đã nằm trong list này rồi!');
            return;
        }

        moveCard(
            {
                cardId,
                targetBoardId: selectedBoardId,
                targetListId: selectedListId,
            },
            {
                onSuccess: () => {
                    toast.success('Move card successfully!');
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    toast.error(
                        error.response?.data?.message || 'Cannot move card. Please try again.',
                    );
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-90">
                <DialogHeader>
                    <DialogTitle>Move Card</DialogTitle>
                    <DialogDescription>
                        Select the destination board and list to move this card.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Board Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Destination Board</label>
                        <Select value={selectedBoardId} onValueChange={handleBoardChange}>
                            <SelectTrigger className="w-full" disabled={isLoadingBoards}>
                                <SelectValue placeholder="Select board..." />
                            </SelectTrigger>
                            <SelectContent>
                                {boards.map((board) => (
                                    <SelectItem key={board.id} value={board.id}>
                                        {board.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* List Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Destination List</label>
                        <Select
                            value={selectedListId}
                            onValueChange={setSelectedListId}
                            disabled={listsData.length === 0 || isLoadingLists}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select list..." />
                            </SelectTrigger>
                            <SelectContent>
                                {listsData.map((list: any) => (
                                    <SelectItem key={list.id} value={list.id}>
                                        {list.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {listsData.length === 0 && (
                            <p className="text-xs text-gray-500">This board has no lists.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleMove} disabled={isMoving || !selectedListId}>
                        {isMoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Move Card
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
