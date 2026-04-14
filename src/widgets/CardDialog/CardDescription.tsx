import TextEditor from '@/shared/components/TextEditor';
import { Button } from '@/shared/ui/button';

interface Props {
    description: string | null;
    isEditingDescription?: boolean;
    setDescription: (description: string) => void;
    handleUpdateCard: () => void;
    setIsEditingDescription: (isEditing: boolean) => void;
}

export default function CardDescription({
    description,
    isEditingDescription,
    setDescription,
    handleUpdateCard,
    setIsEditingDescription,
}: Props) {
    const hasDescription = !!description?.trim();

    return (
        <div className="mt-2">
            {isEditingDescription ? (
                <div className="rounded-lg border bg-card p-3">
                    <TextEditor value={description ?? ''} onChange={setDescription} />
                    <div className="mt-3 flex items-center gap-2">
                        <Button onClick={handleUpdateCard}>Save</Button>
                        <Button variant="secondary" onClick={() => setIsEditingDescription(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    className="w-full rounded-lg border bg-card px-3 py-3 text-left transition-colors hover:bg-accent/40"
                    onClick={() => setIsEditingDescription(true)}
                >
                    {hasDescription ? (
                        <div className="prose prose-sm max-w-none wrap-break-word text-foreground">
                            <div dangerouslySetInnerHTML={{ __html: description || '' }} />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Add a more detailed description...
                        </p>
                    )}
                </button>
            )}
        </div>
    );
}
