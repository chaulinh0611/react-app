import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BoardApi } from '../api/board.api';
import type { Board, CreateBoardPayload } from './board.type';

interface InviteByEmail {
    boardId: string;
    email: string;
    role?: string;
}

const boardKeys = {
    all: ['accessible-boards'] as const,
    byId: (boardId: string) => ['board', boardId] as const,
    members: (boardId: string) => ['board-members', boardId] as const,
    template: () => ['board-template'] as const,
};

const normalizeBoards = (result: any): Board[] => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.boards)) return result.boards;
    if (Array.isArray(result?.data?.boards)) return result.data.boards;
    return [];
};

const normalizeBoard = (result: any): Board | null => {
    if (!result) return null;
    if (result.data !== undefined) return normalizeBoard(result.data);
    if (result.board !== undefined) return normalizeBoard(result.board);
    return result as Board;
};

const normalizeMembers = (result: any): any[] => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.members)) return result.members;
    return [];
};

// CRUD Board
export const useGetBoardById = (boardId: string) => {
    return useQuery({
        queryKey: boardKeys.byId(boardId),
        queryFn: async () => normalizeBoard(await BoardApi.getDetailBoard(boardId)),
        enabled: !!boardId,
    });
};

export const useGetAccessibleBoards = () => {
    return useQuery({
        queryKey: boardKeys.all,
        queryFn: async () => normalizeBoards(await BoardApi.getAccessiableBoards()),
    });
};
// Board member
export const useGetBoardMembers = (boardId: string) => {
    return useQuery({
        queryKey: boardKeys.members(boardId),
        queryFn: async () => normalizeMembers(await BoardApi.getMembers(boardId)),
        enabled: !!boardId,
    });
};

export const useBoardTemplateQuery = () => {
    return useQuery({
        queryKey: ['board-template'],
        queryFn: async () => normalizeBoards(await BoardApi.getTemplateBoards()),
    });
};

export const useCreateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateBoardPayload) =>
            normalizeBoard(await BoardApi.createBoard(payload)),
        onSuccess: (board) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
            if (board?.id) {
                queryClient.setQueryData(boardKeys.byId(board.id), board);
            }
        },
    });
};

export const useUpdateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            boardId,
            payload,
        }: {
            boardId: string;
            payload: Partial<CreateBoardPayload>;
        }) => normalizeBoard(await BoardApi.updateBoard(boardId, payload)),
        onSuccess: (board, variables) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
            queryClient.invalidateQueries({ queryKey: boardKeys.byId(variables.boardId) });
            if (board) {
                queryClient.setQueryData(boardKeys.byId(variables.boardId), board);
            }
        },
    });
};

export const useDeleteBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (boardId: string) => BoardApi.deleteBoard(boardId),
        onSuccess: (_, boardId) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
            queryClient.removeQueries({ queryKey: boardKeys.byId(boardId) });
        },
    });
};

export const useInviteMemberByEmail = () => {
    return useMutation({
        mutationFn: ({ boardId, email, role = 'board_member' }: InviteByEmail) =>
            BoardApi.inviteMemberViaEmail(boardId, email, role),
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
            queryClient.invalidateQueries({ queryKey: boardKeys.byId(variables.boardId) });
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
        },
    });
};
