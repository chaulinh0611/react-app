interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

interface RegisterPayload {
    email: string;
    password: string;
    username: string;
}

interface ForgotPasswordPayload {
    email: string;
}

interface ResetPasswordPayload {
    email: string;
    otp: string;
    newPassword: string;
}

interface RefreshTokenResponse {
    accessToken: string;
}

interface SendVerifyEmailPayload {
    email: string;
}

interface VerifyEmailPayload {
    email: string;
    token: string;
}

export type {
    VerifyEmailPayload,
    SendVerifyEmailPayload,
    RefreshTokenResponse,
    ResetPasswordPayload,
    ForgotPasswordPayload,
    LoginPayload,
    LoginResponse,
    RegisterPayload,
};
