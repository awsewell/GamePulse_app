import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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

export default function GameCard({ game, reminderCount, onDelete }) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="relative w-full bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] group">
        <button
          onClick={() => navigate(createPageUrl(`Reminders?gameId=${game.id}`))}
          className="w-full hover:bg-[var(--surface-elevated)] transition-all duration-200 rounded-xl p-2 -m-2"
        >
          <div className="aspect-square rounded-xl bg-[var(--surface-elevated)] mb-3 overflow-hidden flex items-center justify-center p-2">
            <img
              src={game.icon_url}
              alt={game.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <h3 className="font-medium text-sm mb-2 truncate text-left">{game.name}</h3>
          <Badge
            variant="secondary"
            className="bg-[var(--surface-elevated)] text-[var(--text)] border border-[var(--border)] text-xs"
          >
            {reminderCount} {reminderCount === 1 ? 'reminder' : 'reminders'}
          </Badge>
        </button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteDialog(true);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-lg hover:bg-[var(--background)] opacity-0 group-hover:opacity-100 transition-opacity"
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
