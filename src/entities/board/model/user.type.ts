export interface User {
    id: string;
    email: string;
    username: string;
    fullName?: string;
    bio?: string;
    avatarUrl?: string;
    jobTitle?: string; 
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UpdateUserPayload {
    fullName?: string;
    bio?: string;
    jobTitle?: string;
    location?: string;
}