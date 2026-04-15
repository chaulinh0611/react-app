import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BoardApi } from '../api/board.api';
import type { Board, CreateBoardPayload } from './board.type';

interface InviteByEmail {
    boardId: string;
    email: string;
    role?: string;
}

interface UpdateMemberRolePayload {
    boardId: string;
    userId: string;
    roleName: string;
}

const boardKeys = {
    all: ['boards'] as const,
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
        queryKey: ['board', boardId],
        queryFn: () => BoardApi.getDetailBoard(boardId),
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

//Get archive board
export const useGetArchivedBoards = () => {
    return useQuery({
        queryKey: ['archived-boards'],
        queryFn: async () => normalizeBoards(await BoardApi.getArchivedBoards()),
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
            workspaceId?: string;
            payload: Partial<CreateBoardPayload>;
        }) => normalizeBoard(await BoardApi.updateBoard(boardId, payload)),
        onSuccess: (board, variables) => {
            queryClient.setQueryData(boardKeys.byId(variables.boardId), board);

            queryClient.setQueryData(boardKeys.all, (old: Board[] = []) =>
                old.map((b) => (b.id === variables.boardId ? { ...b, ...board } : b)),
            );

            if (variables.workspaceId) {
                queryClient.invalidateQueries({
                    queryKey: ['workspaces', variables.workspaceId, 'boards'],
                });
            }
        },
    });
};

export const useArchiveBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ boardId }: { boardId: string; workspaceId?: string }) =>
            BoardApi.archiveBoard(boardId),

        onSuccess: (_, { boardId, workspaceId }) => {
            if (workspaceId) {
                queryClient.invalidateQueries({
                    queryKey: ['workspaces', workspaceId, 'boards'],
                });
            }

            queryClient.invalidateQueries({ queryKey: boardKeys.all });
            queryClient.invalidateQueries({ queryKey: boardKeys.byId(boardId) });
        },
    });
};
export const useUnarchiveBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { boardId: string; workspaceId: string }) =>
            BoardApi.unarchiveBoard(data.boardId),

        onSuccess: (_, { boardId, workspaceId }) => {
            queryClient.invalidateQueries({ queryKey: ['archived-boards'] });

            queryClient.invalidateQueries({
                queryKey: ['workspaces', workspaceId, 'boards'],
            });

            queryClient.invalidateQueries({ queryKey: boardKeys.all });
            queryClient.invalidateQueries({ queryKey: boardKeys.byId(boardId) });
        },
    });
};

export const useDeleteBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ boardId }: { boardId: string }) => BoardApi.deleteBoard(boardId),
        onSuccess: (_, { boardId }) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            queryClient.removeQueries({ queryKey: boardKeys.byId(boardId) });
        },
    });
};

export const useInviteMemberByEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ boardId, email, role = 'board_member' }: InviteByEmail) =>
            BoardApi.inviteMemberViaEmail(boardId, email, role),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.members(variables.boardId) });
        },
    });
};

export const useUpdateBoardMemberRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ boardId, userId, roleName }: UpdateMemberRolePayload) =>
            BoardApi.updateMemberRole(boardId, userId, roleName),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.members(variables.boardId) });
            queryClient.invalidateQueries({ queryKey: boardKeys.byId(variables.boardId) });
        },
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
        queryFn: () => BoardApi.joinBoard(token).then((res) => res.data),
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

export const useCreateBoardFromTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            templateId,
            payload,
        }: {
            templateId: string;
            payload: CreateBoardPayload;
        }) => {
            const result = await BoardApi.createBoardFromTemplate(templateId, payload);
            return normalizeBoard(result);
        },
        onSuccess: (board) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
            if (board?.id) {
                queryClient.setQueryData(boardKeys.byId(board.id), board);
            }
        },
    });
};

export const useCreateBoardTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            boardId,
            category,
            copyCard,
        }: {
            boardId: string;
            category?: string;
            copyCard?: boolean;
        }) => BoardApi.createBoardTemplate(boardId, { category, copyCard }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.template() });
        },
    });
};

export const useGetStarredBoards = () => {
    return useQuery({
        queryKey: ['starred-boards'],
        queryFn: async () => normalizeBoards(await BoardApi.getStarredBoards()),
    });
};

export const useToggleStarBoard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ boardId }: { boardId: string }) => BoardApi.toggleStarBoard(boardId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['starred-boards'] });
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
        },
    });
};

export const useGetBoardActivities = (boardId: string) => {
    return useQuery({
        queryKey: ['board-activities', boardId],
        queryFn: async () => {
            const res = await BoardApi.getBoardActivities(boardId);
            return res.data;
        },
        enabled: !!boardId,
    });
};
