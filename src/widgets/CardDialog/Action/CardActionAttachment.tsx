import { File } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';

interface CardActionAttachmentProps {
    onAttachmentUpload?: (file: File) => Promise<void>;
}

export default function CardActionAttachment({ onAttachmentUpload }: CardActionAttachmentProps) {
    const [attachmentError, setAttachmentError] = useState('');
    const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

    const handleAttachmentChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        if (!onAttachmentUpload) {
            toast.error('Attachment upload is unavailable.');
            return;
        }

        try {
            setAttachmentError('');
            setIsUploadingAttachment(true);
            await onAttachmentUpload(file);
        } catch (error: any) {
            setAttachmentError(error?.message || 'Attachment upload failed');
            toast.error(error?.message || 'Attachment upload failed');
        } finally {
            setIsUploadingAttachment(false);
        }
    };

    return (
        <>
            <label>
                <input className="hidden" type="file" onChange={handleAttachmentChange} />
                <Button
                    variant={'outline'}
                    className="text-[12px] rounded-sm"
                    type="button"
                    disabled={isUploadingAttachment}
                    asChild
                >
                    <span>
                        <File />
                        {isUploadingAttachment ? 'Uploading...' : 'Attachment'}
                    </span>
                </Button>
            </label>

            {attachmentError ? <p className="text-xs text-red-500">{attachmentError}</p> : null}
        </>
    );
}
