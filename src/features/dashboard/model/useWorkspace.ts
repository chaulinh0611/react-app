import { WorkspaceApi } from "@/entities/workspace/api/workspace.api";

export const useWorkspace = () => {
    const getAllWorkspacesOfUser = async () => {
        const workspaces = await WorkspaceApi.getWorkspaces();
        return workspaces;
    }
    return { getAllWorkspacesOfUser };
}