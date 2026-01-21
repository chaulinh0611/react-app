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
        group relative h-[300px]
        cursor-pointer
        rounded-xl
        border-2 border-dashed border-muted
        bg-card
        transition-all
        hover:-translate-y-1 hover:shadow-lg
        hover:border-primary
      "
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-muted-foreground group-hover:text-primary">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed group-hover:border-primary"> 
          <Plus className="h-6 w-6" /> 
        </div>

        {/* Text */}
        <h3 className="text-base font-semibold">
          Create new board
        </h3>

        <p className="text-sm text-center text-muted-foreground px-6">
          Add a board to organize your work
        </p>
      </div>
    </Card>
  )
}
