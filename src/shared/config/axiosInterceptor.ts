import axios from "axios";
import queryString from "query-string";
import { getCookie, setCookie } from "@/shared/lib/cookie";
import { getLocalStorage, setLocalStorage } from "@/shared/lib/storage";
import { Authenticate } from "@/shared/constants/auth";
import { authApi } from "@/shared/api/authApi";
import type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const keyHeader = {
  AUTHORIZATION: "Authorization",
  REFRESH_TOKEN: "X-Refresh-Token",
};

export const keyStorage = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};


type LogoutHandler = () => void;


const onRequestSuccess = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const auth = getCookie(Authenticate.AUTH);
  config.timeout = 10000;
  config.headers = config.headers ?? {};

  if (auth) {
    config.headers.Authorization = `Bearer ${auth}`;
    config.headers["x-api-key"] = keyHeader.AUTHORIZATION;
  }

  if (config.params) {
    config.paramsSerializer = {
      serialize: (params: Record<string, unknown>) =>
        queryString.stringify(params),
    };
  }

  return config;
};


const onResponseSuccess = (response: AxiosResponse) => response.data;

const refreshToken = async (
  error: AxiosError,
  logout: LogoutHandler
): Promise<AxiosResponse | void> => {
  const refreshTokenValue = getLocalStorage<string>(Authenticate.REFRESH_TOKEN_ETC);

  if (!refreshTokenValue) {
    logout();
    return;
  }

  try {
    const { data }: AxiosResponse<{
      username: string;
      accessToken: string;
      refreshToken: string;
    }> = await authApi.refreshToken({ refreshToken: refreshTokenValue });

    setLocalStorage({
      key: Authenticate.REFRESH_TOKEN_ETC,
      value: data.refreshToken,
    });
    setCookie(
      Authenticate.AUTH,
      JSON.stringify({
        username: data.username,
        accessToken: data.accessToken,
      }),
      0.02
    );

    if (error.config) {
      error.config.headers = error.config.headers ?? {};
      error.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return axios.request(error.config);
    }
  } catch {
    logout();
  }
};



const onResponseError = (
  error: AxiosError,
  onUnauthenticated: LogoutHandler
): Promise<AxiosResponse | unknown> => {
  if (
    error.response?.status !== 401 ||
    error.config?.url?.includes("/auth")
  ) {
    const errMessage =
      error.response?.data ?? error?.response ?? error;
    return Promise.reject(errMessage);
  }


  return refreshToken(error, onUnauthenticated) as Promise<AxiosResponse>;
};


export default function AxiosInterceptor(
  onUnauthenticated: LogoutHandler
): void {
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(
    onResponseSuccess,
    (error) => onResponseError(error, onUnauthenticated)
  );
}
