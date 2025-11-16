import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function CountdownTimer({ reminder, compact = false }) {
  const [timeLeft, setTimeLeft] = useState("");
  const queryClient = useQueryClient();

  const resetMutation = useMutation({
    mutationFn: async () => {
      const now = new Date().toISOString();
      const updates = {
        last_reset_time: now
      };

      if (reminder.type === "interval") {
        const totalMinutes = (reminder.interval_hours || 0) * 60 + (reminder.interval_minutes || 0);
        const nextTrigger = new Date(Date.now() + totalMinutes * 60 * 1000).toISOString();
        updates.next_trigger_time = nextTrigger;
      }

      if (reminder.milestone_enabled) {
        updates.milestone_progress = (reminder.milestone_progress || 0) + 1;
      }

      return base44.entities.Reminder.update(reminder.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!reminder.next_trigger_time) {
        setTimeLeft("Not scheduled");
        return;
      }

      const now = Date.now();
      const target = new Date(reminder.next_trigger_time).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Ready!");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        setTimeLeft(`${days}d ${remainingHours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [reminder.next_trigger_time]);

  if (compact) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-secondary)]">{timeLeft}</span>
        {reminder.type === "interval" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              resetMutation.mutate();
            }}
            className="h-7 px-2 text-xs hover:bg-[var(--background)]"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] rounded-xl p-4">
      <div className="text-center mb-3">
        <div className="text-2xl font-light mb-1">{timeLeft}</div>
        <div className="text-xs text-[var(--text-secondary)]">
          {reminder.type === "interval" ? "Until next reset" : "Next occurrence"}
        </div>
      </div>
      {reminder.type === "interval" && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            resetMutation.mutate();
          }}
          variant="outline"
          className="w-full border-[var(--border)] hover:bg-[var(--surface)] h-9"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Now
        </Button>
      )}
    </div>
  );
}
