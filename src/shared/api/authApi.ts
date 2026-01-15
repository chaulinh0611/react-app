import axios from 'axios'

export const authApi = {
    refreshToken: (body: { refreshToken: string }) => {
        return axios.post('/api/auth/refresh-token', body)
    },

    login: (body: { email: string; password: string }) => axios.post('/api/auth/login', body)
}
