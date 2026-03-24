export interface User {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    bio?: string;
    avatarUrl?: string;
    googleID?: string;
    isActive?: boolean;
    jobTitle?: string;
    location?: string;
    createdAt?: string;
    updatedAt?: string;
}
