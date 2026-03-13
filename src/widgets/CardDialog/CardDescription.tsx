import TextEditor from "@/shared/components/TextEditor";
import { Button } from "@/shared/ui/button";


interface Props {
    description: string | null;
    isEditingDescription?: boolean;
    setDescription: (description: string) => void;
    handleUpdateCard: () => void;
    setIsEditingDescription: (isEditing: boolean) => void;
}

export default function CardDescription({ description, isEditingDescription, setDescription, handleUpdateCard, setIsEditingDescription }: Props) {

    return (
        <div className="mt-4  ">
            {isEditingDescription ? (
                <div>
                    <TextEditor value={description} onChange={setDescription} />
                    <div className="mt-2 flex gap-2">
                        <Button onClick={handleUpdateCard}>Save</Button>
                        <Button variant={'secondary'} onClick={() => setIsEditingDescription(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className = "prose prose-sm max-w-full! px-2 py-5 rounded-sm border break-words">
                    <div dangerouslySetInnerHTML={{__html: description || ""}}/>
                </div>
            )}
        </div>
    )
}