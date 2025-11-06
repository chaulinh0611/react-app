import { Kanban, Plus, Users } from "lucide-react"

interface Board {
  name: string
  desc: string
  lists: number
  members: number
}

interface Props {
  title: string
  subtitle: string
  boards: Board[]
}

export default function WorkspaceSection({ title, subtitle, boards }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <Kanban className="w-4 h-4 text-white" />
            </div>
            {title}
          </h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
          <p className="text-xs text-gray-400">{boards.length} boards</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md border bg-white text-sm font-medium 
                     h-9 px-4 py-2 shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-all"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Board
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boards.map((board, i) => (
          <div
            key={i}
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow py-6 flex flex-col gap-6 cursor-pointer"
          >
            <div className="px-6 pb-1">
              <div className="font-semibold text-base flex items-center gap-2 mb-1">
                <Kanban className="h-4 w-4" />
                {board.name}
              </div>
              <div className="text-sm text-gray-500">{board.desc}</div>
            </div>

            <div className="px-6 pt-0 flex items-center justify-between text-xs text-gray-500">
              <span>{board.lists} lists</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{board.members}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
