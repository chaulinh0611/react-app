import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import queryString from "query-string";
import { authApi } from "@/shared/api/authApi";
import { logout } from "@/shared/utils/logout";

export const keyHeader = {
  AUTHORIZATION: "Authorization",
};

export const keyStorage = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

const onRequestSuccess = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  config.timeout = 10000;

  const headers = (config.headers || {}) as AxiosRequestHeaders;
  const token = localStorage.getItem(keyStorage.ACCESS_TOKEN);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  config.headers = headers;

  if (config.params) {
    config.paramsSerializer = {
      serialize: (params: Record<string, unknown>) => queryString.stringify(params),
    };
  }

  return config;
};

const onResponseSuccess = (response: AxiosResponse) => {
  return response?.data ?? response;
};

let isRefreshing = false;
interface FailedRequest {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

const onResponseError = async (error: AxiosError) => {
  const originalRequest = error.config;
  if (!error.response || !originalRequest) return Promise.reject(error);

  if (originalRequest.url?.includes("/auth/refresh")) {
    logout();
    return Promise.reject(error);
  }

  if (error.response.status === 401 && !(originalRequest as any)._retry) {
    (originalRequest as any)._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            const headers = (originalRequest.headers || {}) as AxiosRequestHeaders;
            headers.Authorization = `Bearer ${token}`;
            originalRequest.headers = headers;
            resolve(axios(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(keyStorage.REFRESH_TOKEN);
      if (!refreshToken) throw new Error("Missing refresh token");
      const res = await authApi.refreshToken({ refreshToken });

      localStorage.setItem(keyStorage.ACCESS_TOKEN, res.accessToken);
      localStorage.setItem(keyStorage.REFRESH_TOKEN, res.refreshToken);

      processQueue(null, res.accessToken);

      const headers = (originalRequest.headers || {}) as AxiosRequestHeaders;
      headers.Authorization = `Bearer ${res.accessToken}`;
      originalRequest.headers = headers;

      return axios(originalRequest);
    } catch (err: unknown) {
      processQueue(err, null);
      logout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

export default function AxiosInterceptor(): void {
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
}
