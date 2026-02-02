import { useNavigate } from 'react-router-dom';
import { authApi } from '@/entities/auth/api/auth.api';
import type { RegisterPayload } from '@/entities/auth/model/auth.type';

export const useLogin = () => {
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            localStorage.setItem('accessToken', response.data.accessToken);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (payload: RegisterPayload) => {
        try {
            await authApi.register(payload);
            navigate('/login');
        } catch (error) {
            console.error('Register failed:', error);
            throw error;
        }
    };

    const loginWithGoogle = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return {
        login,
        register,
        loginWithGoogle,
    };
};
