import { useMemo } from 'react';
import { FileText, Paperclip, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { useCardAttachments, useDeleteCardAttachment } from '@/entities/card';
import { Label } from '@/shared/ui/label';

interface Props {
    cardId: string;
}

export default function CardAttachments({ cardId }: Props) {
    const { data: attachments = [], isLoading } = useCardAttachments(cardId);
    const deleteAttachment = useDeleteCardAttachment();

    const handleDownload = (fileUrl: string, fileName: string) => {
        try {
            // Create a link with download attribute
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.log(error);
            window.open(fileUrl, '_blank');
        }
    };

    const sortedAttachments = useMemo(
        () => [...attachments].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
        [attachments],
    );

    if (!isLoading && sortedAttachments.length === 0) {
        return <div />;
    }

    return (
        <div className="mt-4 space-y-3 rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between gap-2"></div>

            {isLoading && <p className="text-xs text-gray-500">Loading attachments...</p>}
            <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                <Label>Attachments</Label>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {sortedAttachments.map((attachment: any) => (
                    <Card
                        key={attachment.id}
                        className="group relative flex flex-col items-center justify-center gap-2 p-4 text-center shadow-none hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleDownload(attachment.fileUrl, attachment.fileName)}
                    >
                        <div className="flex w-full flex-col items-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div className="w-full min-w-0">
                                <p className="line-clamp-2 text-xs font-medium text-gray-900">
                                    {attachment.fileName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(attachment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteAttachment.mutate(attachment.id);
                            }}
                            disabled={deleteAttachment.isPending}
                            aria-label="Delete attachment"
                        >
                            <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
