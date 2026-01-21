import type { Board } from "@/entities/board/model/board.type"
import { Link } from "react-router-dom"
import {
  Kanban,
  Users,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react"
import { useContext } from "react"

import { Card, CardContent } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

import { useBoardStore } from "@/entities/board/model/board.store"
import { useMemberCountByBoardId } from "@/entities/board-member/model/board-member.selector"
import { useListCountByBoardId } from "@/entities/list/model/list.selector"
import { SetIsEditDialogOpenContext } from "../context"

type Props = {
  board: Board
  viewMode: "grid" | "list"
}

export function BoardCard({ board, viewMode }: Props) {
  const { deleteBoard } = useBoardStore()
  const listCount = useListCountByBoardId(board.id)
  const memberCount = useMemberCountByBoardId(board.id)
  const setIsEditDialogOpen = useContext(SetIsEditDialogOpenContext)

  const handleDelete = () => {
    if (confirm(`Delete "${board.title}"?`)) {
      deleteBoard(board.id)
    }
  }

  /* ================= LIST MODE ================= */
  if (viewMode === "list") {
    return (
      <Link to={`/board/${board.id}`} className="block mb-3">
        <Card className="group transition hover:bg-muted/30">
          <CardContent className="flex items-center gap-6 px-6 py-5 p-4 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Kanban className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1 space-y-1.5">
              <h3 className="font-semibold leading-tight">
                {board.title}
              </h3>

              {board.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {board.description}
                </p>
              )}

              <div className="mt-1 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span>{listCount} lists</span>
                <span>{memberCount} members</span>
                <span>
                  Created{" "}
                  {new Date(board.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete()
                    }}
                    className="text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  /* ================= GRID MODE ================= */
 return (
    <Card
      className="
        group relative h-[300px]
        rounded-xl border bg-card
        transition-all
        hover:-translate-y-1 hover:shadow-lg
      "
    >
      {/* Actions */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link to={`/board/${board.id}`} className="block h-full">
        <CardContent className="flex h-full flex-col gap-3 p-4 pt-4">
          <div className="flex items-start gap-3">
            <Kanban className="h-6 w-6 mt-1 text-muted-foreground" />
            <h3 className="text-lg font-bold line-clamp-2">
              {board.title}
            </h3>
          </div>

          {board.description && (
            <p className="mt-2 text-muted-foreground line-clamp-3">
              {board.description}
            </p>
          )}

          <div className="flex items-center gap-6 between text-sm text-muted-foreground">
            <span>{listCount} lists</span>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{memberCount} members</span>
            </div>
          </div>

         
        </CardContent>
      </Link>
    </Card>
  )

}
