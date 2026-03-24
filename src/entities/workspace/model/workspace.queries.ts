import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkspaceApi } from '../api/workspace.api';
import type { Workspace, WorkspaceMember } from './workspace.type';

// ─── Normalizers ───────────────────────────────────────────────────────────────

const normalizeWorkspaces = (result: any): Workspace[] => {
    if (Array.isArray(result)) return result;
    if (result && Array.isArray(result.data)) return result.data;
    if (result && Array.isArray(result.workspaces)) return result.workspaces;
    return [];
};

const normalizeWorkspace = (result: any): Workspace => {
    if (result && result.data !== undefined) return normalizeWorkspace(result.data);
    if (result && result.workspace !== undefined) return normalizeWorkspace(result.workspace);
    return result;
};

const normalizeMembers = (result: any): WorkspaceMember[] => {
    if (Array.isArray(result)) return result;
    if (result && Array.isArray(result.data)) return result.data;
    if (result && Array.isArray(result.members)) return result.members;
    return [];
};

const normalizeShareLink = (result: any): string => {
    if (typeof result === 'string') return result;
    if (result?.data?.link) return result.data.link;
    if (result?.link) return result.link;
    if (result?.data?.token) return result.data.token;
    if (result?.token) return result.token;
    if (result?.data) return normalizeShareLink(result.data);
    return String(result ?? '');
};

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const workspaceKeys = {
    all: ['workspaces'] as const,
    byId: (id: string) => ['workspaces', id] as const,
    members: (id: string) => ['workspaces', id, 'members'] as const,
    boards: (id: string) => ['workspaces', id, 'boards'] as const,
};

// ─── Queries ───────────────────────────────────────────────────────────────────

export const useWorkspacesQuery = () =>
    useQuery({
        queryKey: workspaceKeys.all,
        queryFn: async () => normalizeWorkspaces(await WorkspaceApi.getWorkspaces()),
    });

export const useArchivedWorkspacesQuery = () =>
    useQuery({
        queryKey: ['workspaces', 'archived'] as const,
        queryFn: async () => normalizeWorkspaces(await WorkspaceApi.getArchivedWorkspaces()),
    });

export const useWorkspaceByIdQuery = (id: string) =>
    useQuery({
        queryKey: workspaceKeys.byId(id),
        queryFn: async () => normalizeWorkspace(await WorkspaceApi.getWorkspaceById(id)),
        enabled: !!id,
    });

export const useWorkspaceMembersQuery = (workspaceId: string) =>
    useQuery({
        queryKey: workspaceKeys.members(workspaceId),
        queryFn: async () => normalizeMembers(await WorkspaceApi.getWorkspaceMembers(workspaceId)),
        enabled: !!workspaceId,
    });

export const useWorkspaceBoardsQuery = (workspaceId: string) =>
    useQuery({
        queryKey: workspaceKeys.boards(workspaceId),
        queryFn: () => WorkspaceApi.getBoardsInWorkspace(workspaceId),
        enabled: !!workspaceId,
    });

// ─── Mutations ─────────────────────────────────────────────────────────────────

export const useCreateWorkspaceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { title: string; description?: string }) =>
            WorkspaceApi.createWorkspace(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
        },
    });
};

export const useUpdateWorkspaceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: { title?: string; description?: string };
        }) => WorkspaceApi.updateWorkspace(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
            queryClient.invalidateQueries({ queryKey: workspaceKeys.byId(variables.id) });
        },
    });
};

export const useDeleteWorkspaceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => WorkspaceApi.deleteWorkspace(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
        },
    });
};

export const useArchiveWorkspaceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => WorkspaceApi.archiveWorkspace(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
            queryClient.invalidateQueries({ queryKey: workspaceKeys.byId(id) });
        },
    });
};

export const useUnarchiveWorkspaceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => WorkspaceApi.unarchiveWorkspace(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
            queryClient.invalidateQueries({ queryKey: workspaceKeys.byId(id) });
        },
    });
};

export const useInviteWorkspaceMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ workspaceId, email }: { workspaceId: string; email: string }) =>
            WorkspaceApi.inviteByEmail(workspaceId, email),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.members(variables.workspaceId),
            });
        },
    });
};

export const useAddWorkspaceMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ workspaceId, email }: { workspaceId: string; email: string }) =>
            WorkspaceApi.addWorkspaceMember(workspaceId, email),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.members(variables.workspaceId),
            });
        },
    });
};

export const useRemoveWorkspaceMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ workspaceId, email }: { workspaceId: string; email: string }) =>
            WorkspaceApi.removeWorkspaceMember(workspaceId, email),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.members(variables.workspaceId),
            });
        },
    });
};

export const useCreateShareLinkMutation = () =>
    useMutation({
        mutationFn: async (workspaceId: string) =>
            normalizeShareLink(await WorkspaceApi.createShareLink(workspaceId)),
    });

export const useRevokeShareLinkMutation = () =>
    useMutation({
        mutationFn: (token: string) => WorkspaceApi.revokeShareLink(token),
    });
