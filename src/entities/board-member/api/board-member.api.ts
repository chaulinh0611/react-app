import axios from "axios";
import type { ApiResponse } from '@/shared/models/response'
import type { BoardMember } from '../model/board-member.type'

export const BoardMemberApi = {
  getMembersByBoardId: (boardId: string) =>
    axios.get<ApiResponse<BoardMember[]>>(
      `/boards/${boardId}/members`
    ),
}
