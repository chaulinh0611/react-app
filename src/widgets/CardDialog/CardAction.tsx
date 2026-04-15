import CardActionAttachment from './Action/CardActionAttachment';
import CardActionDueDate from './Action/CardActionDueDate';
import CardActionChecklist from './Action/CardActionChecklist';
import CardActionLabels from './Action/CardActionLabels';
import CardActionMembers from './Action/CardActionMembers';

interface CardActionProps {
    cardId: string;
    dueDate?: string | null;
    onAttachmentUpload?: (file: File) => Promise<void>;
}

export default function CardAction({ cardId, dueDate, onAttachmentUpload }: CardActionProps) {
    return (
        <div className="flex gap-3">
            <CardActionMembers cardId={cardId} />
            <CardActionLabels cardId={cardId} />
            <CardActionChecklist cardId={cardId} />
            <CardActionDueDate cardId={cardId} dueDate={dueDate} />
            <CardActionAttachment onAttachmentUpload={onAttachmentUpload} />
        </div>
    );
}
