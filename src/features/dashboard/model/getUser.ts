import axios from 'axios'

export const getUser = async () => {
    try {
        const response = await axios.get('/api/auth/me')
        return response.data.data
    } catch (error) {
        console.error('Failed to fetch user data:', error)
        throw error
    }
}
