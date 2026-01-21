import { create } from 'zustand'
import type { List } from './list.type'
import { ListApi } from '../api/list.api'

interface ListState {
  lists: List[]
  loading: boolean
}

interface ListActions {
  fetchLists: () => Promise<void>
  createList: (boardId: string, title: string) => Promise<void>
  updateList: (id: string, payload: { title?: string; position?: number }) => Promise<void>
  deleteList: (id: string) => Promise<void>
  archiveList: (id: string) => Promise<void>
  unarchiveList: (id: string) => Promise<void>
}

export const useListStore = create<ListState & ListActions>((set) => ({
  lists: [],
  loading: false,

  fetchLists: async () => {
    set({ loading: true })
    try {
      const res = await ListApi.getAllLists()
      console.log("Get all list: ", res.data)
      set({ lists: res.data, loading: false })
    } catch (err) {
      console.error('fetchLists error', err)
      set({ loading: false })
    }
  },

  createList: async (boardId, title) => {
    const res = await ListApi.createList({ boardId, name: title })
    set((state) => ({ lists: [...state.lists, res.data.data] }))
  },

  updateList: async (id, payload) => {
    const res = await ListApi.updateList(id, {
      name: payload.title,
      position: payload.position,
    })

    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === id ? { ...l, ...res.data.data } : l
      ),
    }))
  },

  deleteList: async (id) => {
    await ListApi.deleteList(id)
    set((state) => ({
      lists: state.lists.filter((l) => l.id !== id),
    }))
  },

  archiveList: async (id) => {
    await ListApi.archiveList(id)
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === id ? { ...l, isArchived: true } : l
      ),
    }))
  },

  unarchiveList: async (id) => {
    await ListApi.unarchiveList(id)
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === id ? { ...l, isArchived: false } : l
      ),
    }))
  },
}))
