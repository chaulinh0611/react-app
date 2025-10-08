import axios from "axios";
import { keyStorage } from "@/shared/constants/auth";
import { storage } from "@/shared/lib/storage";

export const authApi = {
  refreshToken: async (body?: { refreshToken?: string }) => {
    const refreshToken =
      body?.refreshToken ?? storage.get(keyStorage.REFRESH_TOKEN);

    if (!refreshToken || typeof refreshToken !== "string") {
      return null;
    }

    const response = await axios.post("/auth/refresh", { refreshToken });
    const { accessToken } = response.data;

    storage.set(keyStorage.ACCESS_TOKEN, accessToken);
    return accessToken;
  },
};
