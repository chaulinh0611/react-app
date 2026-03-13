import { create } from 'zustand'
import { SearchApi } from '../api/search.api'
import type { SearchData } from './search.type'

interface SearchState {
    searchResults: SearchData
    isSearching: boolean
    globalSearch: (keyword: string) => Promise<void>
}

export const useSearchStore = create<SearchState>((set) => ({
    searchResults: {
        cards: [],
        boards: [],
        workspaces: [],
        members: []
    },
    isSearching: false,
    globalSearch: async (keyword: string) => {
        if (!keyword.trim()) {
            set({
                searchResults: { cards: [], boards: [], workspaces: [], members: [] },
                isSearching: false
            })
            return
        }

        try {
            set({ isSearching: true })
            const response = await SearchApi.globalSearch(keyword)
            set({ searchResults: response.data, isSearching: false })
        } catch (error) {
            console.error('Search failed:', error)
            set({ isSearching: false })
        }
    }
}))
