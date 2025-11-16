import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, Target } from "lucide-react";
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

export default function ReminderCard({ reminder, onDelete, gameId }) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div
        onClick={() => navigate(createPageUrl(`ReminderEditor?gameId=${gameId}&reminderId=${reminder.id}`))}
        className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)] hover:bg-[var(--surface-elevated)] transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium mb-1 truncate">{reminder.name}</h3>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Clock className="w-3 h-3" />
              <span>{reminder.type === "interval" ? "Interval" : "Fixed"}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="w-8 h-8 rounded-lg hover:bg-[var(--background)]"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

        <CountdownTimer reminder={reminder} />

        {reminder.milestone_enabled && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Target className="w-4 h-4" />
                <span>Milestone</span>
              </div>
              <span className="font-medium">
                {reminder.milestone_progress || 0}/{reminder.milestone_target}
              </span>
            </div>
          </div>
        )}
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
