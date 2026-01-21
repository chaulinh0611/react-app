export interface Workspace {
  id: string;
  title: string;
}

export interface Board {
  id: string;
  title: string;                
  description?: string;
  permissionLevel: 'private' | 'workspace' | 'public';

  backgroundPath?: string;       

  workspace: Workspace;   
  isArchived: boolean;      
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardPayload {
    title: string;
    description?: string;
    workspaceId: string;
    permissionLevel?: 'private' | 'workspace' | 'public';
    backgroundUrl?: string;
}