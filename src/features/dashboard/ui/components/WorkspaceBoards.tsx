import { useState } from 'react';
import type { Board } from '@/entities/board/model/board.type';
import { Link } from 'react-router-dom';
import { Users, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Archive } from 'lucide-react';
import { useDeleteBoard, useArchiveBoard, useGetBoardMembers } from '@/entities/board/model/useBoard';
import { useListStore } from '@/entities/list/model/list.store';
import { CreateBoardDialog } from './CreateBoardDialog';

type Props = {
  board: Board;
  viewMode: 'grid' | 'list';
};

export function WorkspaceBoards({ board, viewMode }: Props) {
  const archiveBoard = useArchiveBoard();
  const deleteBoard = useDeleteBoard();
  const { data: members = [] } = useGetBoardMembers(board.id);
  const memberCount = members.length;
  const listCount = useListStore((state) => state.boardsLists[board.id]?.length || 0);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Delete "${board.title}"?`)) {
      try {
        await deleteBoard.mutateAsync(board.id);
      } catch (err) {
        console.error(err);
        alert('Could not delete board.');
      }
    }
  };

  const handleArchiveToggle = async () => {
    try {
      await archiveBoard.mutateAsync(board.id);
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  // ===== LIST VIEW =====
  if (viewMode === 'list') {
    return (
      <>
        <Link to={`/board/${board.id}`} className="block mb-3">
          <Card className="group transition hover:bg-muted/30 overflow-hidden">
            <CardContent className="flex items-center gap-4 p-3">
              <div className="relative h-12 w-20 rounded-md overflow-hidden flex-shrink-0">
                {board.backgroundPath ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${board.backgroundPath})` }}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-black/20" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <h3 className="font-semibold">{board.title}</h3>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>{listCount} lists</span>
                  <span>{memberCount} members</span>
                  <span>{new Date(board.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleArchiveToggle}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        </Link>

        {/* Dialog edit board */}
        {isEditDialogOpen && (
          <CreateBoardDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            workspaceId={board.workspace.id}
            boardToEdit={board}
          />
        )}
      </>
    );
  }

  // ===== GRID VIEW =====
  return (
    <>
      <Card className="group relative rounded-xl overflow-hidden hover:shadow-lg">
        {board.backgroundPath ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition"
              style={{ backgroundImage: `url(${board.backgroundPath})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
        )}

        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleArchiveToggle}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link to={`/board/${board.id}`} className="block h-full">
          <CardContent className="relative z-10 text-white p-3 flex flex-col justify-between h-full">
            <h3 className="font-semibold line-clamp-2">{board.title}</h3>
            <div className="flex justify-between text-xs">
              <span>{listCount} lists</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{memberCount}</span>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>

      {isEditDialogOpen && (
        <CreateBoardDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          workspaceId={board.workspace.id}
          boardToEdit={board}
        />
      )}
    </>
  );
}