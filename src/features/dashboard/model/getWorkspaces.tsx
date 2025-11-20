import axios from 'axios'

export const getWorkspaces = async () => {
    try {
        const token = localStorage.getItem('accessToken')
        const response = await axios.get(`api/workspaces`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        console.error('Failed to fetch workspaces:', error)
        throw error
    }
}
