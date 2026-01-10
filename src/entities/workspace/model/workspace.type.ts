interface Workspace {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    isArchived: boolean;
}

export type { Workspace };