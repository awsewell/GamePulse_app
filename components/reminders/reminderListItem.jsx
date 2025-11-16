import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronRight, Clock } from "lucide-react";
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
import CountdownTimer from "./CountdownTimer";

export default function ReminderListItem({ reminder, onDelete, gameId }) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div
        onClick={() => navigate(createPageUrl(`ReminderEditor?gameId=${gameId}&reminderId=${reminder.id}`))}
        className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)] hover:bg-[var(--surface-elevated)] transition-all duration-200 cursor-pointer flex items-center gap-3"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm mb-2 truncate">{reminder.name}</h3>
          <CountdownTimer reminder={reminder} compact />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteDialog(true);
          }}
          className="w-8 h-8 rounded-lg hover:bg-[var(--background)] flex-shrink-0"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
        <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[var(--surface)] border-[var(--border)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--text)]">Delete Reminder</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--text-secondary)]">
              Are you sure you want to delete this reminder? This action cannot be undone.
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
