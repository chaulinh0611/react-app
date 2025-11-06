import React from "react"
import Sidebar from "../../../components/Sidebar"
import WorkspaceSection from "./WorkspaceSection"

export default function DashboardPage() {
  const companyBoards = [
    { name: "Project Alpha", desc: "Main project board", lists: 3, members: 2 },
    { name: "Marketing Campaign", desc: "Q4 Marketing initiatives", lists: 1, members: 2 },
  ]

  const personalBoards = [
    { name: "Personal Todo", desc: "Personal tasks and goals", lists: 1, members: 1 },
  ]

  return (
    <div className="flex min-h-screen bg-white">
  
      <Sidebar />

      <div className="flex flex-col flex-1">
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
        </header>


        <main className="flex-1 p-8 space-y-6">
      
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Manage your workspaces and boards
              </p>
            </div>

            <button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:opacity-90 flex items-center gap-2">
              <span className="text-lg font-semibold">＋</span> New Workspace
            </button>
          </div>

          <div className="space-y-10">
            <WorkspaceSection
              title="Company Workspace"
              subtitle="Main company workspace"
              boards={companyBoards}
            />

            <WorkspaceSection
              title="Personal Projects"
              subtitle="Personal project workspace"
              boards={personalBoards}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
