export interface Comment {
    id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
    user: any

}

export interface CreateComment {
    content: string,
    cardId: string
}

export interface UpdateComment {
    content: string
}