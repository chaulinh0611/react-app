import React, { useState } from "react"
import {
  SidebarGroupLabel,
  SidebarGroup,
  SidebarMenuSub,
} from "@/shared/ui/sidebar"
import { PanelsTopLeft, Kanban, ChevronDown } from "lucide-react"

export default function Sidebar() {
  const [openBoards, setOpenBoards] = useState(false)

  return (
    <aside className="w-64 border-r bg-white flex flex-col justify-between">
      <div>
        <div className="p-2">
          <button
            type="button"
            className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 h-12 text-left text-sm outline-hidden transition hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-gray-100"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Kanban className="size-4" />
            </div>

            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold text-gray-900">
                Company Workspace
              </span>
              <span className="truncate text-xs text-gray-500">
                Main company workspace
              </span>
            </div>

            <ChevronDown className="ml-auto size-4 text-gray-500" />
          </button>
        </div>

        <nav className="mt-3">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-sm font-medium text-gray-800 rounded-md"
          >
            <PanelsTopLeft className="h-4 w-4" />
            Dashboard
          </a>

          <SidebarGroup className="p-2">
            <SidebarGroupLabel>Boards</SidebarGroupLabel>

            <button
              onClick={() => setOpenBoards(!openBoards)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 w-full hover:bg-gray-50 rounded-md"
            >
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  openBoards ? "rotate-180" : ""
                }`}
              />
              <Kanban className="h-4 w-4 text-gray-500" />
              <span className="text-gray-800">All Boards</span>
            </button>

            {openBoards && (
              <SidebarMenuSub
                className="
                  mx-[0.9rem] flex min-w-0 translate-x-px flex-col gap-1 
                  border-l border-gray-200 px-2.5 py-0.5
                "
              >
                <a
                  href="#"
                  className="
                    flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden 
                    rounded-md px-2 text-sm text-gray-700
                    hover:bg-gray-100 hover:text-gray-900 
                    focus-visible:ring-2 focus-visible:ring-blue-500
                    active:bg-gray-100
                  "
                >
                  <span>Project Alpha</span>
                </a>

                <a
                  href="#"
                  className="
                    flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden 
                    rounded-md px-2 text-sm text-gray-700
                    hover:bg-gray-100 hover:text-gray-900 
                    focus-visible:ring-2 focus-visible:ring-blue-500
                    active:bg-gray-100
                  "
                >
                  <span>Marketing Campaign</span>
                </a>
              </SidebarMenuSub>
            )}
          </SidebarGroup>
        </nav>
      </div>

      <div className="p-4 border-t flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="text-sm leading-tight">
          <div className="font-medium text-gray-800">John Doe</div>
          <div className="text-xs text-gray-500">john@example.com</div>
        </div>
      </div>
    </aside>
  )
}
