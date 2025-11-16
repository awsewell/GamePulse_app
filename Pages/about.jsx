import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gamepad2 } from "lucide-react";

export default function About() {
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
            <h1 className="text-2xl font-light tracking-tight">About</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] text-center">
          <div className="w-20 h-20 rounded-3xl bg-[var(--primary-blue)] mx-auto mb-6 flex items-center justify-center">
            <Gamepad2 className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-3xl font-light mb-2">GamePulse</h2>
          <p className="text-[var(--text-secondary)] mb-8">Your Gaming Companion</p>
          
          <div className="space-y-4 text-sm text-[var(--text-secondary)]">
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span>Version</span>
              <span className="text-[var(--text)]">1.0.0</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span>Platform</span>
              <span className="text-[var(--text)]">Progressive Web App</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span>Build</span>
              <span className="text-[var(--text)]">2025.01</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              GamePulse helps gamers manage in-game timers, daily resets, and weekly events 
              with customizable reminders and milestone tracking. Never miss an important 
              game event again.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xs text-[var(--text-secondary)]">
              Made with precision for gamers worldwide
            </p>
          </div>
        </div>

        <div className="mt-6 bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">Features</h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span>✓</span>
              <span>Interval & fixed reminders</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Milestone tracking</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Quiet time management</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Dark & light themes</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Local data storage</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Export & import configurations</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>No ads, no subscriptions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
