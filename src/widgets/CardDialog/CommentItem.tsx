import type { Comment } from '@/entities/comment/model/type';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useState } from 'react';
import { useDeleteComment, useUpdateComment } from '@/entities/comment/model/useComment';
import { Input } from '@/shared/ui/input';
import type { User } from '@/entities/auth/model/type';

interface Props {
    cmt: Comment;
    user: User;
}

export default function CommentItem({ cmt, user }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [comment, setComment] = useState(cmt.content);

    const { mutate: deleteComment } = useDeleteComment();
    const { mutate: updateComment } = useUpdateComment();

    function handleUpdateComment(commentId: string, content: string) {
        updateComment(
            { commentId, content },
            {
                onSuccess() {
                    setComment('');
                    setIsEditing(false);
                },
            },
        );
    }

    function handleDeleteComment(commentId: string) {
        deleteComment(commentId);
    }

    return (
        <div key={cmt.id} className="flex items-start gap-2 my-2">
            <Avatar className="mt-2">
                <AvatarImage src={cmt.user.avatarUrl} />
                <AvatarFallback>{cmt.user.username}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full">
                <div className="flex gap-2 items-center">
                    <span className="font-semibold">{cmt.user.username}</span>
                    <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(cmt.createdAt), {
                            addSuffix: true,
                        })}
                    </span>
                </div>

                {/* Comment content && input */}
                {!isEditing ? (
                    <p className="bg-gray-300 px-3 py-2 rounded-sm  shadow-sm">{cmt.content}</p>
                ) : (
                    <Input
                        value={comment}
                        onKeyDown={(e) => e.key == 'Enter' && handleUpdateComment(cmt.id, comment)}
                        onChange={(e) => setComment(e.target.value)}
                    />
                )}

                {/* Comment action */}
                {cmt.user.id == user?.id && (
                    <div className="flex gap-1 text-[13px] text-muted-foreground">
                        <Button
                            className="p-1 cursor-pointer underline text-muted-foreground"
                            variant="link"
                            size={'xs'}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            className="cursor-pointer underline text-muted-foreground"
                            variant="link"
                            size={'xs'}
                            onClick={() => handleDeleteComment(cmt.id)}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
