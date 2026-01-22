export interface BoardMember {
  id: string
  userId: string
  boardId: string
  role: string
  joinedAt: string

  user: {
    id: string
    username: string
    email: string
    avatar: string | null
  }
}
