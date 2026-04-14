import { Label } from '@/shared/ui/label';
import { MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { useAuth } from '@/entities/auth/model/useAuth';
import { useComment, useCreateComment } from '@/entities/comment/model/useComment';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Input } from '@/shared/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import CommentItem from './CommentItem';

interface Props {
    cardId: string;
}

export default function CardComment({ cardId }: Props) {
    const { data: me } = useAuth();
    const { data: comments } = useComment(cardId);
    const currentUser = me?.data;
    const sortedComments = [...(comments || [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const { mutate: createComment } = useCreateComment();

    const [comment, setComment] = useState('');

    // handle get comment
    function handleComment() {
        createComment(
            { cardId, content: comment },
            {
                onSuccess: () => {
                    setComment('');
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            },
        );
    }

    // handle update comment
    return (
        <div className="flex-2 min-h-0 py-6 px-4 flex flex-col bg-gray-100">
            <div className="flex items-center gap-2 mb-3 mt-3">
                <MessageSquare className="w-4 h-4" />
                <Label>Comments</Label>
            </div>

            <ScrollArea className="flex-1 min-h-0 pr-3">
                <div className="flex flex-col gap-2">
                    {/* Enter comment */}
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={currentUser?.avatarUrl} />
                            <AvatarFallback>{currentUser?.username}</AvatarFallback>
                        </Avatar>
                        <Input
                            placeholder="Enter your comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                        />
                    </div>
                    {/* Comment list */}
                    <div>
                        {currentUser &&
                            sortedComments?.map((cmt: any) => (
                                <CommentItem key={cmt.id} cmt={cmt} user={currentUser} />
                            ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
