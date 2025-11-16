import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function GameListItem({ game, reminderCount, onDelete }) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="w-full bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:bg-[var(--surface-elevated)] transition-all duration-200 flex items-center group">
        <button
          onClick={() => navigate(createPageUrl(`Reminders?gameId=${game.id}`))}
          className="flex items-center gap-4 p-4 flex-1 min-w-0"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--surface-elevated)] overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
            <img
              src={game.icon_url}
              alt={game.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 text-left min-w-0">
            <h3 className="font-medium text-sm mb-1 truncate">{game.name}</h3>
            <Badge
              variant="secondary"
              className="bg-[var(--surface-elevated)] text-[var(--text)] border border-[var(--border)] text-xs"
            >
              {reminderCount} {reminderCount === 1 ? 'reminder' : 'reminders'}
            </Badge>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
        </button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteDialog(true);
          }}
          className="w-10 h-10 rounded-lg hover:bg-[var(--background)] mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[var(--surface)] border-[var(--border)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--text)]">Delete Game</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--text-secondary)]">
              Are you sure you want to delete "{game.name}"? All associated reminders will also be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--border)]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
