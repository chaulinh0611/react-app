import { useRef, type ChangeEvent } from 'react';
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu';
import { useUploadBoardBackground } from '@/entities/board/model/useBoard';
import { Image, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

export const ChangeBackgroundSubMenu = () => {
    const { boardId = '' } = useParams();
    const inputRef = useRef<HTMLInputElement>(null);

    const { mutate: uploadBackground, isPending } = useUploadBoardBackground();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !boardId) return;

        uploadBackground(
            { boardId, file },
            {
                onSuccess: () => {
                    toast.success('Board background updated successfully');
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to update board background');
                },
            },
        );

        // reset input to allow selecting the same file again
        event.target.value = '';
    };

    return (
        <>
            <DropdownMenuSubTrigger>
                <Image />
                Change Background
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent className="w-64 p-2">
                <DropdownMenuLabel>Board Background</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={isPending}
                    onSelect={(event) => {
                        event.preventDefault();
                        inputRef.current?.click();
                    }}
                >
                    <Upload />
                    {isPending ? 'Uploading...' : 'Upload from device'}
                </DropdownMenuItem>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </DropdownMenuSubContent>
        </>
    );
};
