import axios from "axios";
import type { ApiResponse } from "@/shared/models/response";
import type { User, UpdateUserPayload } from "../model/user.type";

export const UserApi = {
    getMe: (): Promise<ApiResponse<User>> => {
        return axios.get('/users/profile'); 
    },
    updateProfile: (payload: UpdateUserPayload): Promise<ApiResponse<User>> => {
        return axios.patch('/users', payload); 
    },
    uploadAvatar: (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
        const formData = new FormData();
        formData.append('avatar', file); 
        
        return axios.post('/users/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
};