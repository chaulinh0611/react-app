import axios from "axios";
import type { ApiResponse } from "@/shared/models/response";
import type { User, UpdateUserPayload } from "../model/user.type";

export const UserApi = {
    getMe: (): Promise<ApiResponse<User>> => {
        return axios.get('/auth/me'); 
    },

    updateProfile: (payload: UpdateUserPayload): Promise<ApiResponse<User>> => {
        return axios.put('/users/profile', payload);
    },
    
    uploadAvatar: (file: File): Promise<ApiResponse<{ url: string }>> => {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post('/users/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};