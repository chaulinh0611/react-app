import { authApi } from "../api/auth.api";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: () => authApi.getProfile(),
    });
};
