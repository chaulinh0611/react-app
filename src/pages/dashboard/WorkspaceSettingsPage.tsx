import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "@/entities/workspace/model/workspace.store";

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();

  const {
    currentWorkspace,
    fetchWorkspaceById,
    updateWorkspace,
    archiveWorkspace,
    unarchiveWorkspace,
    deleteWorkspace,
    isLoading,
  } = useWorkspaceStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");



  useEffect(() => {
    if (!workspaceId) return;
    fetchWorkspaceById(workspaceId);
  }, [workspaceId]);

  useEffect(() => {
    if (!currentWorkspace) return;
    setTitle(currentWorkspace.title || "");
    setDescription(currentWorkspace.description || "");
  }, [currentWorkspace]);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;

    try {
      await updateWorkspace(workspaceId, {
        title,
        description,
      });
      alert("Workspace updated successfully");
    } catch (err) {
      console.error(err);
    }
  };


  const handleArchiveToggle = async () => {
    if (!workspaceId || !currentWorkspace) return;

    try {
      if (currentWorkspace.isArchived) {
        await unarchiveWorkspace(workspaceId);
        alert("Workspace reopened");
      } else {
        await archiveWorkspace(workspaceId);
        alert("Workspace archived");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!workspaceId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteWorkspace(workspaceId);
      alert("Workspace deleted");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };


  if (isLoading && !currentWorkspace) {
    return <div className="p-6">Loading workspace...</div>;
  }

  if (!currentWorkspace) {
    return <div className="p-6">Workspace not found</div>;
  }

  return (
    <div className="w-full h-screen overflow-y-auto bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-3xl space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow">
            {title?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {title}
            </h1>
            <p className="text-sm text-gray-500">
              Manage workspace settings
            </p>
          </div>
        </div>


        {/* GENERAL */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">
            General Information
          </h2>

          <form onSubmit={handleSave} className="space-y-4">

            <div>
              <label className="text-sm text-gray-500">
                Workspace Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Description
              </label>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-md"
            >
              Save Changes
            </button>

          </form>
        </section>


        {/* STATUS */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Workspace Status
          </h2>

          <p className="text-sm text-gray-600 flex items-center gap-2">
            Current status:

            <span
              className={`px-2 py-1 text-xs rounded-full font-medium
              ${
                currentWorkspace.isArchived
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {currentWorkspace.isArchived ? "Archived" : "Active"}
            </span>
          </p>

          <button
            onClick={handleArchiveToggle}
            className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white transition"
          >
            {currentWorkspace.isArchived
              ? "Reopen Workspace"
              : "Archive Workspace"}
          </button>
        </section>


        {/* DELETE */}
        <section className="bg-red-50 rounded-xl border border-red-300 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-red-600">
            Danger Zone
          </h2>

          <p className="text-sm text-red-500">
            Deleting a workspace is permanent and cannot be undone.
          </p>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-2 rounded-md"
          >
            Delete Workspace
          </button>
        </section>

      </div>
    </div>
  );
}