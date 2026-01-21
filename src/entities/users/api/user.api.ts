import axios from "axios";
import type { ApiResponse } from "@/shared/models/response";
import type { User, UpdateUserPayload } from "../model/user.type";

export const UserApi = {
    getMe: (): Promise<ApiResponse<User>> => {
        return axios.get('/auth/me'); 
    },
    updateProfile: (payload: UpdateUserPayload): Promise<ApiResponse<User>> => {
        return axios.put('/users/profile', payload);
    }
};