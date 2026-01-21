import { create } from 'zustand';
import type { User } from './user.type';
import { UserApi } from '../api/user.api';

interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

interface UserAction {
    fetchUser: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState & UserAction>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await UserApi.getMe();
            set({ user: res.data, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
        }
    },

    updateUser: async (data) => {
        set({ isLoading: true });
        try {
            const res = await UserApi.updateProfile(data);
            set({ user: res.data, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },
}));