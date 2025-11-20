import axios from 'axios'

export const getAllBoards = async () => {
    try{
        const token = localStorage.getItem('accessToken')
        const response = await axios.get(`api/boards`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        console.error('Failed to fetch boards:', error)
        throw error
    }
}
