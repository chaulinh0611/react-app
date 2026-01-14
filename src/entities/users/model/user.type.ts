interface User {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    bio: string | null;
    avatarUrl: string | null;
    isActive: boolean;
    googleId: string | null;
}

export type {
    User,
};