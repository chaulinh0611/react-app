
import BoardLayout from "@/features/board/ui/BoardLayout";
import { useParams } from "react-router-dom";

export default function BoardPage() {

    const { boardId } = useParams();
    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex flex-col flex-1">
                <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold text-gray-900">Personal plan</h1>
                    </div>
                </header>

                <main className="flex-1 p-8 space-y-6 bg-[#F1F5F9]">
                    <div className="flex justify-between items-start mb-8">
                        <BoardLayout boardId={boardId as string} />
                    </div>
                </main>
            </div>
        </div>
    );
}
