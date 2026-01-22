import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { WorkspaceApi } from "@/entities/workspace/api/workspace.api";
import type { Workspace } from "@/entities/workspace/model/workspace.type";

interface WorkspaceContextType {
  workspaces: Workspace[];
  isLoading: boolean;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const res = await WorkspaceApi.getWorkspaces();
      
      const data = Array.isArray(res.data) ? res.data : [];
      setWorkspaces(data);
    } catch (error) {
      console.error("Failed to fetch workspaces", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <WorkspaceContext.Provider value={{ workspaces, isLoading, refreshWorkspaces: fetchWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used within a WorkspaceProvider");
  }
  return context;
};