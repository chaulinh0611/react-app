export type { Comment, CreateComment, UpdateComment } from './model/type';

export {
    useComment,
    useCommentById,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
} from './model/useComment';

export { commentApi } from './api/comment.api';
