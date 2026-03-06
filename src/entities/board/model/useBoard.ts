import { useQuery } from "@tanstack/react-query"
import { BoardApi } from "../api/board.api"


// Board members
export const useGetBoardMembers = (boardId: string) => {
    return useQuery({
        queryKey: ['board-members', boardId],
        queryFn: () => BoardApi.getMembers(boardId),
    })
}
