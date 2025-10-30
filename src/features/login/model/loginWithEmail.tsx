import axios from "axios";
import {setCookie} from '@/shared/lib/cookie';
import {setLocalStorage} from '@/shared/lib/storage';
import {Authenticate} from "@/shared/constants/auth"

export const submit = async (email: string, password: string, navigate: (path: string) => void) => {
  try {
    const { data } = await axios.post("/auth/login", { email, password });

    setCookie(
      Authenticate.AUTH,
      JSON.stringify({
        username: data.username,
        accessToken: data.accessToken,
      }),
      1 
    );

    setLocalStorage({
      key: Authenticate.REFRESH_TOKEN_ETC,
      value: data.refreshToken,
    });

    navigate("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
  }
};
