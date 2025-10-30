import axios from "axios";

export const authApi = {
  refreshToken: (body: { refreshToken: string }) =>{
    return axios.post("http://localhost:3000/auth/refresh", body);
  },

  login: (body: { email: string; password: string }) =>
    axios.post("http://localhost:3000/auth/login", body),
};
