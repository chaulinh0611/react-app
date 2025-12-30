import Sidebar from "../../../components/Sidebar";
import WorkspaceSection from "./WorkspaceSection";
import { useEffect, useState } from "react";
import { getUser } from "@/features/dashboard/model/getUser";
import { getWorkspaces } from "@/features/dashboard/model/getWorkspaces";

interface Board {
  id: string;
  title: string;
  description: string;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  boards?: Board[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getUser();
        setUser(userRes);

        const wsRes = await getWorkspaces();

        if (Array.isArray(wsRes)) {
          setWorkspaces(wsRes);
        } else if (wsRes?.data && Array.isArray(wsRes.data)) {
          setWorkspaces(wsRes.data);
        } else {
          console.warn("getWorkspaces() returned unexpected:", wsRes);
          setWorkspaces([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


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
            {workspaces.map((ws) => (
              <WorkspaceSection
                key={ws.id}
                title={ws.name}
                subtitle={ws.description}
                boards={(ws.boards ?? []).map((b) => ({
                  name: b.title,
                  desc: b.description || "No description",
                  lists: 0,
                  members: 0,
                }))}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
