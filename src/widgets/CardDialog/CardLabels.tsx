import { Label } from '@/shared/ui/label';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { LABEL_COLOR_HEX, type LabelColor } from '@/entities/label/model/label.type';
import { useCardLabels } from '@/entities/label/model/useLabel';
import { cn } from '@/shared/lib/utils';

interface CardLabelsProps {
    cardId: string;
}

export default function CardLabels({ cardId }: CardLabelsProps) {
    const { data: labels = [] } = useCardLabels(cardId);

    if (labels.length === 0) return null;

    const labelTextClass = (color: LabelColor) =>
        color === 'yellow' || color === 'orange' ? 'text-foreground' : 'text-primary-foreground';

    return (
        <div className="mt-4 flex flex-col gap-3 rounded-md">
            <div className="flex items-center gap-2">
                <Label className="text-xs">Labels</Label>
            </div>

            <ScrollArea className="max-h-24">
                <div className="flex flex-wrap gap-2 pr-2">
                    {labels.map((label) => (
                        <span
                            key={label.id}
                            className={cn(
                                'inline-flex h-7 items-center rounded-sm px-3 text-xs font-semibold',
                                labelTextClass(label.color),
                            )}
                            style={{ backgroundColor: LABEL_COLOR_HEX[label.color] }}
                        >
                            {label.name || label.color}
                        </span>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
