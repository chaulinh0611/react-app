import { Plus } from "lucide-react"
import { Card, CardContent } from "@/shared/ui/card"

type Props = {
  onClick: () => void
  viewMode?: "grid" | "list"
}

export function CreateBoardCard({ viewMode, onClick }: Props) {
  /* ================= LIST MODE ================= */
  if (viewMode === "list") {
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
            <h3 className="font-semibold">
              Create new board
            </h3>
            <p className="text-sm text-muted-foreground">
              Add a board to organize your work
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  /* ================= GRID MODE ================= */
  return (
    <Card
      onClick={onClick}
      className="
        group relative h-[200px]
        cursor-pointer
        rounded-xl
        border-2 border-dashed border-gray-300
        bg-gray-50/50
        transition-all
        hover:-translate-y-1 hover:shadow-lg
        hover:border-blue-400 hover:bg-blue-50/50
      "
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 text-gray-500 group-hover:text-blue-600">
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-gray-300 group-hover:border-blue-400">
          <Plus className="h-5 w-5" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-sm font-semibold mb-1">
            Create new board
          </h3>
          <p className="text-xs text-gray-400 px-4">
            Add a board to organize your work
          </p>
        </div>
      </div>
    </Card>
  )
}
