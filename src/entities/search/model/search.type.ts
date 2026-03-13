import type { Card } from '@/entities/card/model/card.type'
import type { Board } from '@/entities/board/model/board.type'
import type { Workspace } from '@/entities/workspace/model/workspace.type'

// Assuming a simplified User type is enough for search UI
export interface SearchUser {
    id: string
    username: string
    email: string
    fullName: string
    avatarUrl?: string
}

export interface SearchData {
    cards: Card[]
    boards: Board[]
    workspaces: Workspace[]
    members: SearchUser[]
}
