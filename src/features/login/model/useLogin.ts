import { useNavigate } from "react-router-dom";
import { authApi } from "@/entities/auth/api/auth.api";
export const useLogin = () => {
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            console.log(response.data)

            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const loginWithGoogle = () => {
        window.location.href = "http://localhost:3000/auth/google";
    };

    return {
        login,
        loginWithGoogle,
    };
}