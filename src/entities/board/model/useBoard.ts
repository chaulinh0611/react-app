import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BoardApi } from '../api/board.api';

interface InviteByEmail {
    boardId: string;
    email: string;
}

// CRUD Board
export const useGetBoardById = (boardId: string) => {
    return useQuery({
        queryKey: ['board', boardId],
        queryFn: () => BoardApi.getDetailBoard(boardId).then((res) => res.data),
    });
};

export const useGetAccessibleBoards = () => {
    return useQuery({
        queryKey: ['accessible-boards'],
        queryFn: () => BoardApi.getAccessiableBoards().then((res) => res.data),
    });
};
// Board member
export const useGetBoardMembers = (boardId: string) => {
    return useQuery({
        queryKey: ['board-members', boardId],
        queryFn: () => BoardApi.getMembers(boardId).then((res) => res.data),
    });
};

export const useInviteMemberByEmail = () => {
    return useMutation({
        mutationFn: ({ boardId, email }: InviteByEmail) =>
            BoardApi.inviteMemberViaEmail(boardId, email),
    });
};

export const useInviteMemberByLink = () => {
    return useMutation({
        mutationFn: ({ boardId }: { boardId: string }) =>
            BoardApi.createLinkInvite(boardId).then((res) => res.data),
    });
};

export const useRevokeLink = () => {
    return useMutation({
        mutationFn: ({ boardId }: { boardId: string }) =>
            BoardApi.revokeLink(boardId).then((res) => res.data),
    });
};

export const useJoinBoard = (token: string) => {
    return useQuery({
        queryKey: ['join-board', token],
        queryFn: () => BoardApi.joinBoard(token),
        enabled: !!token,
    });
};

export const useUploadBoardBackground = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ boardId, file }: { boardId: string; file: File }) =>
            BoardApi.uploadBackground(boardId, file),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['board', variables.boardId] });
            queryClient.invalidateQueries({ queryKey: ['accessible-boards'] });
        },
    });
};
