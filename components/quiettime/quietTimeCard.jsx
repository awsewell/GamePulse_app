import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BEHAVIOR_LABELS = {
  delay: "Send at end",
  suppress: "Suppress",
  silent: "Silent",
  manual: "Manual per reminder"
};

export default function QuietTimeCard({ quietTime, onDelete }) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const selectedDays = quietTime.days?.map(d => DAYS_OF_WEEK[d]).join(", ") || "No days";

  return (
    <>
      <div
        onClick={() => navigate(createPageUrl(`QuietTimeEditor?id=${quietTime.id}`))}
        className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)] hover:bg-[var(--surface-elevated)] transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium mb-1 truncate">{quietTime.name}</h3>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Clock className="w-3 h-3" />
              <span>{quietTime.start_time} - {quietTime.end_time}</span>
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

        <div className="space-y-3">
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">Days</p>
            <p className="text-sm">{selectedDays}</p>
          </div>
          
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">Behavior</p>
            <Badge
              variant="secondary"
              className="bg-[var(--primary-blue)] bg-opacity-10 text-[var(--primary-blue)] border-0"
            >
              {BEHAVIOR_LABELS[quietTime.behavior] || quietTime.behavior}
            </Badge>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[var(--surface)] border-[var(--border)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--text)]">Delete Quiet Time</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--text-secondary)]">
              Are you sure you want to delete this quiet time period? This action cannot be undone.
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
