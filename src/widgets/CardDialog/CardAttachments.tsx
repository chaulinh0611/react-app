import { useMemo } from 'react';
import { FileText, Trash2, Upload } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
    useCardAttachments,
    useDeleteCardAttachment,
    useUploadCardAttachment,
} from '@/entities/card';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

interface Props {
    cardId: string;
}

export default function CardAttachments({ cardId }: Props) {
    const { data: attachments = [], isLoading } = useCardAttachments(cardId);
    const uploadAttachment = useUploadCardAttachment();
    const deleteAttachment = useDeleteCardAttachment();
    const { addToast } = useAnimatedToast();

    const sortedAttachments = useMemo(
        () => [...attachments].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
        [attachments],
    );

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        try {
            await uploadAttachment.mutateAsync({ cardId, file });
            addToast({
                title: 'Attachment added',
                message: file.name,
                type: 'success',
            });
        } catch (error: any) {
            addToast({
                title: 'Attachment failed',
                message: error?.message || 'Could not upload attachment.',
                type: 'error',
            });
        }
    };

    return (
        <div className="mt-4 space-y-3 rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between gap-2">
                <label>
                    <input className="hidden" type="file" onChange={handleFileChange} />
                    <Button type="button" variant="outline" size="sm" className="gap-2" asChild>
                        <span>
                            <Upload className="h-4 w-4" />
                            Upload
                        </span>
                    </Button>
                </label>
            </div>

            {isLoading && <p className="text-xs text-gray-500">Loading attachments...</p>}

            {!isLoading && sortedAttachments.length === 0 && (
                <p className="text-xs text-gray-500">No attachments on this card.</p>
            )}

            <div className="space-y-2">
                {sortedAttachments.map((attachment: any) => (
                    <Card
                        key={attachment.id}
                        className="flex items-center justify-between gap-3 p-3 shadow-none"
                    >
                        <a
                            href={attachment.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-w-0 items-center gap-3"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900">
                                    {attachment.fileName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Uploaded {new Date(attachment.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </a>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAttachment.mutate(attachment.id)}
                            disabled={deleteAttachment.isPending}
                            aria-label="Delete attachment"
                        >
                            <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
