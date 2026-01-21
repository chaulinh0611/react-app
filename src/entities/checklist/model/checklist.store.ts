import { CheckListApi } from '../apis/checklist.api';
import type { Checklist, ChecklistItem, ChecklistState, ChecklistAction } from '../model/checklist.type';
import { create } from 'zustand';

const initState: ChecklistState = {
    checklists: {},
    checklistItems: {},
    cardChecklists: {},
    isLoading: false,
    error: null,
};

export const useChecklistStore = create<ChecklistState & ChecklistAction>((set) => ({
    ...initState,
    getChecklistsOnCard: async (cardId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await CheckListApi.getChecklists({ cardId });
            const checklists: any[] = response.data;
            set((state) => {
                const checklistsMap: Record<string, Checklist> = { ...state.checklists };
                const itemsMap: Record<string, ChecklistItem> = { ...state.checklistItems };
                const cardChecklists: string[] = [];

                checklists.forEach((checklist: any) => {
                    // Store checklist items if they exist
                    if (checklist.items && Array.isArray(checklist.items)) {
                        checklist.items.forEach((item: ChecklistItem) => {
                            itemsMap[item.id] = item;
                        });
                        // Convert items array to just IDs
                        checklistsMap[checklist.id] = {
                            ...checklist,
                            items: checklist.items.map((item: ChecklistItem) => item.id),
                        };
                    } else {
                        checklistsMap[checklist.id] = checklist;
                    }
                    cardChecklists.push(checklist.id);
                });

                return {
                    ...state,
                    checklists: checklistsMap,
                    checklistItems: itemsMap,
                    cardChecklists: {
                        ...state.cardChecklists,
                        [cardId]: cardChecklists,
                    },
                    isLoading: false,
                };
            });
            return;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return;
        }
    },
    getChecklistItems: async (checklistId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await CheckListApi.getChecklistItems(checklistId);
            const items: ChecklistItem[] = response.data;
            set((state) => {
                const checklist = state.checklists[checklistId];
                if (!checklist) {
                    return { ...state, isLoading: false };
                }
                const itemsMap: Record<string, ChecklistItem> = { ...state.checklistItems };
                items.forEach((item: ChecklistItem) => {
                    itemsMap[item.id] = item;
                });
                const updatedChecklist = {
                    ...checklist,
                    items: items.map((item: ChecklistItem) => item.id),
                };
                return {
                    ...state,
                    checklists: {
                        ...state.checklists,
                        [checklistId]: updatedChecklist,
                    },
                    checklistItems: itemsMap,
                    isLoading: false,
                };
            });
            return;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return;
        }
    },
    createChecklist: async (title: string, cardId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await CheckListApi.createChecklist({ title, cardId });
            const newChecklist: Checklist = response.data;
            set((state) => ({
                ...state,
                checklists: {
                    ...state.checklists,
                    [newChecklist.id]: newChecklist,
                },
                cardChecklists: {
                    ...state.cardChecklists,
                    [cardId]: [...(state.cardChecklists[cardId] || []), newChecklist.id],
                },
                isLoading: false,
            }));
            return;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return;
        }
    },

    deleteChecklist: async (checklistId: string) => {
        set({ isLoading: true, error: null });
        try {
            await CheckListApi.deleteChecklist(checklistId);
            set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [checklistId]: _, ...restChecklists } = state.checklists;
                const cardId = state.checklists[checklistId]?.card.id;
                const updatedCardChecklists = (state.cardChecklists[cardId] || []).filter(
                    (id) => id !== checklistId,
                );
                return {
                    ...state,
                    checklists: restChecklists,
                    cardChecklists: {
                        ...state.cardChecklists,
                        [cardId]: updatedCardChecklists,
                    },
                    isLoading: false,
                };
            });
            return;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return;
        }
    },

    addChecklistItem: async (checklistId: string, content: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await CheckListApi.addChecklistItem({ checklistId, content });
            const newItem: ChecklistItem = response.data;
            set((state) => {
                const checklist = state.checklists[checklistId];
                if (!checklist) {
                    return state;
                }
                const updatedChecklist = {
                    ...checklist,
                    items: [...(checklist.items || []), newItem.id],
                };
                return {
                    ...state,
                    checklists: {
                        ...state.checklists,
                        [checklistId]: updatedChecklist,
                    },
                    checklistItems: {
                        ...state.checklistItems,
                        [newItem.id]: newItem,
                    },
                    isLoading: false,
                };
            });
            return;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return;
        }
    },
    updateChecklistItems: async (itemId: string, content: string, isChecked: boolean) => {
        set({ isLoading: true, error: null });
        try {
            await CheckListApi.updateChecklistItems({ itemId, content, isChecked });
            set((state) => ({
                ...state,
                checklistItems: {
                    ...state.checklistItems,
                    [itemId]: {
                        ...state.checklistItems[itemId],
                        content,
                        isChecked,
                    },
                },
                isLoading: false,
            }));
            return;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return;
        }
    },
    deleteChecklistItem: async (itemId: string) => {
        set({ isLoading: true, error: null });
        try {
            await CheckListApi.deleteChecklistItem(itemId);
            set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [itemId]: _, ...restItems } = state.checklistItems;
                // Also remove from checklist items array
                const updatedChecklists = { ...state.checklists };
                Object.keys(updatedChecklists).forEach((checklistId) => {
                    if (updatedChecklists[checklistId].items?.includes(itemId)) {
                        updatedChecklists[checklistId] = {
                            ...updatedChecklists[checklistId],
                            items: updatedChecklists[checklistId].items?.filter(
                                (id) => id !== itemId,
                            ),
                        };
                    }
                });
                return {
                    ...state,
                    checklistItems: restItems,
                    checklists: updatedChecklists,
                    isLoading: false,
                };
            });
            return;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return;
        }
    },
}));
