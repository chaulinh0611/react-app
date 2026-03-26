export const AuthErrorCode = {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];
