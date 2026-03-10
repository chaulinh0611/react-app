import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BoardApi } from "../api/board.api"

interface InviteByEmail {
    boardId: string,
    email: string
}

// Board members
export const useGetBoardMembers = (boardId: string) => {
    return useQuery({
        queryKey: ['board-members', boardId],
        queryFn: () => BoardApi.getMembers(boardId).then(res => res.data),
    })
}

export const useInviteMemberByEmail = () => {
    return useMutation({
        mutationFn: ({ boardId, email }: InviteByEmail) => BoardApi.inviteMemberViaEmail(boardId, email),
    })
}

export const useJoinBoard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ token }: { token: string }) => BoardApi.joinBoard(token).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] })
        }
    })
}