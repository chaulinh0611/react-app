interface Workspace {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    isArchived: boolean;
}

export type { Workspace };