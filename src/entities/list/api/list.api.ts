import type { ApiResponse } from "@/shared/models/response";
import axios from "axios";
import type { List } from "../model/list.type";

export const ListApi = {
  createList: (payload: { boardId: string; name: string }) =>
    axios.post<ApiResponse<List>>("/lists", payload),

  getAllLists: () =>
    axios.get<ApiResponse<List[]>>("/lists"),

  getListDetails: (id: string) =>
    axios.get<ApiResponse<List>>(`/lists/${id}`),

  updateList: (
    id: string,
    payload: { name?: string; position?: number }
  ) =>
    axios.patch<ApiResponse<List>>(`/lists/${id}`, payload),

  deleteList: (id: string) =>
    axios.delete<ApiResponse<void>>(`/lists/${id}`),

  archiveList: (id: string) =>
    axios.patch<ApiResponse<void>>(`/lists/${id}/archive`),

  unarchiveList: (id: string) =>
    axios.patch<ApiResponse<void>>(`/lists/${id}/unarchive`),

  reorderLists: (
    listId: string,
    payload: {
      boardId: string;
      beforeId: string | null;
      afterId: string | null;
    }
  ) =>
    axios.post<ApiResponse<void>>(
      `/lists/${listId}/reorder`,
      payload
    ),

  moveList: (listId: string, boardId: string) =>
    axios.post<ApiResponse<void>>(
      `/lists/${listId}/move`,
      { boardId }
    ),

  duplicateList: (
    listId: string,
    payload: { boardId: string; title?: string }
  ) =>
    axios.post<ApiResponse<List>>(
      `/lists/${listId}/duplicate`,
      payload
    ),
};
