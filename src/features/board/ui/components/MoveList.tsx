import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import {
    DropdownMenuSubContent,
    DropdownMenuPortal,
    DropdownMenuLabel,
} from '@/shared/ui/dropdown-menu';
import { SelectTrigger, Select, SelectContent, SelectValue, SelectItem } from '@/shared/ui/select';
import { useGetAccessibleBoards } from '@/entities/board/model/useBoard';
import {
    useListsByBoardId,
    useReorderLists,
    useMoveListToAnotherBoard,
} from '@/entities/list/model/useList';
import type { Board } from '@/entities/board/model/board.type';
import type { List } from '@/entities/list/model/list.type';

interface Props {
    currentList: string;
    currentBoard: string;
    setIsOpen: (value: boolean) => void;
}

export const MoveList = ({ currentList, currentBoard, setIsOpen }: Props) => {
    const [selectedBoard, setSelectedBoard] = useState<string>(currentBoard);
    const [selectedPosition, setSelectedPosition] = useState<string>('');

    const { data: boards } = useGetAccessibleBoards();
    const { data: lists } = useListsByBoardId(selectedBoard);
    const { mutate: moveListToAnotherBoard } = useMoveListToAnotherBoard();
    const { mutate: reorderLists } = useReorderLists(selectedBoard);

    const handleMoveList = () => {
        if (!selectedBoard || !selectedPosition) return;
        const cleanList = lists?.filter((list: List) => list.id !== currentList) || [];
        if (selectedBoard === currentBoard) {
            // Reorder within the same board
            const positionIndex =
                selectedPosition === 'end' ? cleanList.length : parseInt(selectedPosition);
            reorderLists({
                listId: currentList,
                boardId: selectedBoard,
                beforeId: positionIndex === 0 ? null : cleanList[positionIndex - 1].id,
                afterId: positionIndex === cleanList.length ? null : cleanList[positionIndex].id,
            });
        } else {
            // Move to another board and reorder
            moveListToAnotherBoard({ listId: currentList, boardId: selectedBoard });
            const positionIndex = selectedPosition === 'end' ? lists.length : parseInt(selectedPosition);
            reorderLists({
                listId: currentList,
                boardId: selectedBoard,
                beforeId: positionIndex === 0 ? null : cleanList[positionIndex - 1].id,
                afterId: positionIndex === cleanList.length ? null : cleanList[positionIndex].id,
            });
        }
        setIsOpen(false);
    };

    return (
        <DropdownMenuPortal>
            <DropdownMenuSubContent className="min-w-60 max-w-60 px-2 py-2">
                <DropdownMenuLabel className="text-center">Move list</DropdownMenuLabel>
                <DropdownMenuLabel>Boards</DropdownMenuLabel>

                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                    <SelectTrigger className="w-full mb-2">
                        <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                        {boards?.map((board: Board) => (
                            <SelectItem key={board.id} value={board.id}>
                                {board.title + (board.id === currentBoard ? ' (current)' : '')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <DropdownMenuLabel>Position</DropdownMenuLabel>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                        {lists?.map((list: List, index: number) => (
                            <SelectItem key={list.id} value={index.toString()}>
                                {index + 1}
                            </SelectItem>
                        ))}
                        <SelectItem value="end">End of list</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant={'outline'} className="w-full mt-3" onClick={handleMoveList}>
                    Move
                </Button>
            </DropdownMenuSubContent>
        </DropdownMenuPortal>
    );
};
