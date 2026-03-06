import { Label } from '@/shared/ui/label';
import { MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';
export default function CardComment() {
    return (
        <div className="flex-2 min-h-0 py-6 px-4 flex flex-col bg-gray-100">
            <div className="flex items-center gap-2 mb-3 mt-3">
                <MessageSquare className="w-4 h-4" />
                <Label>Comments</Label>
            </div>

            <ScrollArea className="flex-1 min-h-0">
                <div className="flex flex-col gap-2">s</div>
            </ScrollArea>
        </div>
    );
}
