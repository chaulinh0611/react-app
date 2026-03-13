import axios from 'axios'
import type { SearchData } from '../model/search.type'

export const SearchApi = {
    globalSearch: async (keyword: string) => {
        const response: any = await axios.get<{ message: string, data: SearchData }>(`/search`, { params: { keyword } })
        return response
    }
}
