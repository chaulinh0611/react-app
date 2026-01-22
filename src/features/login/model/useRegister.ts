import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/entities/auth/api/auth.api';
import type { RegisterPayload } from '@/entities/auth/model/auth.type';

export const useRegister = () => {
    const navigate = useNavigate();
    
    const register = async (payload: RegisterPayload) => {
        try {
            await authApi.register(payload);
            navigate('/login');
        } catch (error) {
            console.error('Register failed:', error);
            throw error;
        }
    };

    return { register };
};