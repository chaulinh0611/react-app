import { WorkspaceApi } from "@/entities/workspace/api/workspace.api";

export const useWorkspace = () => {
    const getAllWorkspacesOfUser = async () => {
        const workspaces = await WorkspaceApi.getWorkspaces();
        return workspaces.data;
    }

    const getBoardsInWorkspace = async (workspaceId : string) =>{
        const boards = await WorkspaceApi.getBoardsInWorkspace(workspaceId);
        return boards.data;
    }
    return { getAllWorkspacesOfUser, getBoardsInWorkspace };
}