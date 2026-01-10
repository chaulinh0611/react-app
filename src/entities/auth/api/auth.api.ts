import type * as AuthType from '../model/auth.type';
import type { ApiResponse } from '@/shared/models/response';
import type * as UserType from '@/entities/users/model/user.type';
import axios from 'axios';

export const authApi = {
    login: (payload: AuthType.LoginPayload): Promise<ApiResponse<AuthType.LoginResponse>> => {
        return axios.post('/auth/login', payload);
    },

    register: (payload: AuthType.RegisterPayload): Promise<ApiResponse<void>> => {
        return axios.post('/auth/register', payload);
    },

    forgotPassword: (email: string): Promise<ApiResponse<void>> => {
        return axios.post('/auth/forgot-password', { email });
    },

    resetPassword: (payload: AuthType.ResetPasswordPayload): Promise<ApiResponse<void>> => {
        return axios.post('/auth/reset-password', payload);
    },

    refreshToken: (): Promise<ApiResponse<null>> => {
        return axios.post('/auth/refresh-token');
    },

    sendVerifyEmail: (payload: AuthType.SendVerifyEmailPayload): Promise<ApiResponse<void>> => {
        return axios.post('/auth/send-verify-email', payload);
    },

    verifyEmail: (query: AuthType.VerifyEmailPayload): Promise<ApiResponse<void>> => {
        return axios.get('/auth/verify-email', {
            params: query,
        });
    },

    me: (): Promise<ApiResponse<UserType.User>> => {
        return axios.get('/auth/me');
    }
};
