import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type * as AuthType from './auth.type';
import type { User } from './type';
import type { ApiResponse } from '@/shared/models/response';

// Query Keys
export const authQueryKeys = {
    all: ['auth'] as const,
    profile: () => [...authQueryKeys.all, 'profile'] as const,
    login: () => [...authQueryKeys.all, 'login'] as const,
};

/**
 * Get current user profile
 */
export const useGetProfile = () => {
    return useQuery<ApiResponse<User>, Error>({
        queryKey: authQueryKeys.profile(),
        queryFn: () => authApi.getProfile(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false,
    });
};

/**
 * Login mutation
 */
export const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<AuthType.LoginResponse>, Error, AuthType.LoginPayload>({
        mutationFn: (payload) => authApi.login(payload),
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            // Invalidate profile query to refetch user data
            queryClient.invalidateQueries({ queryKey: authQueryKeys.profile() });
            navigate('/dashboard');
        },
    });
};

/**
 * Register mutation
 */
export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation<ApiResponse<void>, Error, AuthType.RegisterPayload>({
        mutationFn: (payload) => authApi.register(payload),
        onSuccess: (_, variables) => {
            navigate(`/verify-email?email=${encodeURIComponent(variables.email)}`);
        },
    });
};

/**
 * Forgot password mutation
 */
export const useForgotPassword = () => {
    return useMutation<ApiResponse<void>, Error, string>({
        mutationFn: (email) => authApi.forgotPassword(email),
    });
};

/**
 * Reset password mutation
 */
export const useResetPassword = () => {
    const navigate = useNavigate();

    return useMutation<ApiResponse<void>, Error, AuthType.ResetPasswordPayload>({
        mutationFn: (payload) => authApi.resetPassword(payload),
        onSuccess: () => {
            navigate('/login');
        },
    });
};

/**
 * Update user profile
 */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<User>, Error, Partial<User>>({
        mutationFn: (payload) => authApi.updateProfile(payload),
        onSuccess: (data) => {
            // Update the profile query cache with new data
            queryClient.setQueryData(authQueryKeys.profile(), data);
            // Also invalidate to ensure fresh data
            queryClient.invalidateQueries({ queryKey: authQueryKeys.profile() });
        },
    });
};

/**
 * Upload avatar
 */
export const useUploadAvatar = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<User>, Error, FormData>({
        mutationFn: (formData) => authApi.uploadAvatar(formData),
        onSuccess: (data) => {
            // Update the profile query cache
            queryClient.setQueryData(authQueryKeys.profile(), data);
            queryClient.invalidateQueries({ queryKey: authQueryKeys.profile() });
        },
    });
};

/**
 * Refresh token
 */
export const useRefreshToken = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<{ accessToken: string }>, Error>({
        mutationFn: () => authApi.refreshToken(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authQueryKeys.profile() });
        },
    });
};

/**
 * Send verify email
 */
export const useSendVerifyEmail = () => {
    return useMutation<ApiResponse<void>, Error, AuthType.SendVerifyEmailPayload>({
        mutationFn: (payload) => authApi.sendVerifyEmail(payload),
    });
};

/**
 * Verify email
 */
export const useVerifyEmail = () => {
    const navigate = useNavigate();

    return useMutation<ApiResponse<void>, Error, AuthType.VerifyEmailPayload>({
        mutationFn: (payload) => authApi.verifyEmail(payload),
        onSuccess: () => {
            navigate('/login');
        },
    });
};

/**
 * Logout
 */
export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error>({
        mutationFn: async () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
        onSuccess: () => {
            queryClient.setQueryData(authQueryKeys.profile(), null);
            queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
            window.location.assign('/login');
        },
    });
};
