import { useListStore } from "./list.store";
import { useShallow } from "zustand/react/shallow";

export const useListsByBoard = (boardId: string) => {
    return useListStore(
        useShallow(state => {
            const listIds = state.boardsLists[boardId] || [];
            return listIds.map(id => state.lists[id]);
        })
    )
}