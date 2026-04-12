import CardActionAttachment from './Action/CardActionAttachment';
import CardActionChecklist from './Action/CardActionChecklist';
import CardActionLabels from './Action/CardActionLabels';
import CardActionMembers from './Action/CardActionMembers';

interface CardActionProps {
    cardId: string;
    onAttachmentUpload?: (file: File) => Promise<void>;
}

export default function CardAction({ cardId, onAttachmentUpload }: CardActionProps) {
    return (
        <div className="flex gap-3">
            <CardActionMembers cardId={cardId} />
            <CardActionLabels cardId={cardId} />
            <CardActionChecklist cardId={cardId} />
            <CardActionAttachment onAttachmentUpload={onAttachmentUpload} />
        </div>
    );
}
