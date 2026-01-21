import { useBoardMemberStore } from './board-member.store'

export const useMemberCountByBoardId = (boardId: string): number =>
  useBoardMemberStore(
    (state) => state.membersByBoardId[boardId]?.length ?? 0
  )
