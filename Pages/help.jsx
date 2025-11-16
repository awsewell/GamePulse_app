import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Target, Bell } from "lucide-react";

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-6">
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(createPageUrl("Settings"))}
              className="w-10 h-10 rounded-xl hover:bg-[var(--surface)]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-light tracking-tight">Help</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-blue)] bg-opacity-10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--primary-blue)]" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Interval Reminders</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Set a timer that counts down from a specific duration (e.g., 2 hours, 30 minutes). 
                Perfect for game cooldowns, respawn timers, and daily resets. Tap "Reset" when the timer 
                goes off to restart it immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-blue)] bg-opacity-10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[var(--primary-blue)]" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Fixed Reminders</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Schedule notifications for specific times. Choose daily (every day at the same time) 
                or weekly (specific days of the week). Great for weekly raids, daily quests, 
                and scheduled events. Choose between local time or UTC.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-blue)] bg-opacity-10 flex items-center justify-center">
              <Target className="w-5 h-5 text-[var(--primary-blue)]" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Milestone Tracking</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Enable milestone tracking on any reminder to count completions. Set a target 
                (e.g., 25 completions) and track your progress. Each time you reset an interval 
                reminder, the progress increments automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-blue)] bg-opacity-10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[var(--primary-blue)]" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quiet Time (Premium)</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Set up periods when you don't want to be disturbed. Choose to delay notifications 
                until quiet time ends, suppress them entirely, or send them silently. You can also 
                configure per-reminder preferences for more control.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Tips & Tricks</h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span>•</span>
              <span>Toggle between list and card view for games and reminders</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Sort games alphabetically or by number of reminders</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Export your configuration to backup locally</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Free version allows 2 reminders and 1 game</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Premium unlocks unlimited games, reminders, and quiet time</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
