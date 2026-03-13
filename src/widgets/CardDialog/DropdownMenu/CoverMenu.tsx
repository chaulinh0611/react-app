import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { ChevronLeft } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
// import { useUnsplash } from '@/shared/config/unsplash';
import { Button } from '@/shared/ui/button';
import { useUploadBackground } from '@/entities/card/model/useCard';
import { useState } from 'react';
import { Spinner } from '@/shared/ui/spinner';
import { toast } from 'sonner';

interface Props {
    cardId: string;
    setMenu: (menu: string) => void;
}

export default function CoverMenu({ cardId, setMenu }: Props) {
    // const { data: Image  } = useUnsplash();
    const { mutate: uploadBackground, isPending } = useUploadBackground();

    const [file, setFile] = useState<File | null>(null);

    function handleUploadBackground() {
        if (!file) return;
        uploadBackground(
            { cardId, file },
            {
                onError(err) {
                    toast.error(err.message);
                },
            },
        );
    }

    return (
        <div>
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    setMenu('main');
                }}
                className="flex mb-3"
            >
                <ChevronLeft className="w-4 h-4" /> <Label>Back</Label>
            </DropdownMenuItem>
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            {!isPending ? (
                <Button className="mt-3 w-full" onClick={() => handleUploadBackground()}>
                    Upload
                </Button>
            ) : (
                <Button className="mt-3 w-full">
                    <Spinner /> Uploading...
                </Button>
            )}
        </div>
    );
}
