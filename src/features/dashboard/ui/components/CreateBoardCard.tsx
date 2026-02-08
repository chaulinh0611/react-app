import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';

type Props = {
    onClick: () => void;
    viewMode?: 'grid' | 'list';
};

export function CreateBoardCard({ viewMode, onClick }: Props) {
    /* ================= LIST MODE ================= */
    if (viewMode === 'list') {
        return (
            <Card
                onClick={onClick}
                className="
          group cursor-pointer mb-3
          transition hover:bg-muted/40
        "
            >
                <CardContent className="flex items-center gap-6 px-6 py-5 p-4 pt-4">
                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed group-hover:border-primary">
                        <Plus className="h-6 w-6" />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                        <h3 className="font-semibold">Create new board</h3>
                        <p className="text-sm text-muted-foreground">
                            Add a board to organize your work
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    /* ================= GRID MODE ================= */
    return (
        <Card
            onClick={onClick}
            className="
        group relative h-[150px]
        cursor-pointer
        rounded-xl
        border-2 border-dashed
        transition-all
        hover:-translate-y-1 hover:shadow-lg
      "
        >
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 text-gray-500">
                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center">
                    <Plus className="h-8 w-8" />
                </div>
            </div>
        </Card>
    );
}
