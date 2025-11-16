import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun, Crown, Bell, Download, Upload, HelpCircle, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const allSettings = await base44.entities.AppSettings.list();
      return allSettings[0];
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AppSettings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
    },
  });

  const unlockPremiumMutation = useMutation({
    mutationFn: () => {
      return base44.entities.AppSettings.update(settings.id, { is_premium: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
    },
  });

  const theme = settings?.theme || "dark";
  const isPremium = settings?.is_premium || false;
  const snoozeDuration = settings?.snooze_duration || 15;
  const sortBy = settings?.sort_by || "alphabetical";

  const handleExport = async () => {
    const games = await base44.entities.Game.list();
    const reminders = await base44.entities.Reminder.list();
    const quietTimes = await base44.entities.QuietTime.list();

    const exportData = {
      games,
      reminders,
      quietTimes,
      settings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gamepulse-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = JSON.parse(e.target.result);
      
      if (data.games) {
        for (const game of data.games) {
          const { id, created_date, updated_date, created_by, ...gameData } = game;
          await base44.entities.Game.create(gameData);
        }
      }
      
      queryClient.invalidateQueries();
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-6">
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(createPageUrl("Games"))}
              className="w-10 h-10 rounded-xl hover:bg-[var(--surface)]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-light tracking-tight">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {!isPremium && (
          <div className="bg-gradient-to-r from-[var(--primary-blue)] to-blue-600 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Unlock Premium</h3>
                <p className="text-white text-opacity-90 text-sm mb-2">
                  • Unlimited games & reminders<br/>
                  • Quiet time management<br/>
                  • Export & import configurations
                </p>
                <p className="text-white text-opacity-80 text-xs">One-time purchase • No subscription</p>
              </div>
            </div>
            <Button
              onClick={() => unlockPremiumMutation.mutate()}
              className="w-full bg-white text-[var(--primary-blue)] hover:bg-gray-100 rounded-xl h-12 font-medium"
            >
              Unlock Now - $4.99
            </Button>
          </div>
        )}

        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
          <div className="p-4 flex items-center justify-between hover:bg-[var(--surface-elevated)] transition-colors">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
              <div>
                <div className="font-medium text-sm">Theme</div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                updateSettingsMutation.mutate({
                  id: settings.id,
                  data: { theme: theme === "dark" ? "light" : "dark" }
                });
              }}
              className="rounded-lg"
            >
              Toggle
            </Button>
          </div>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
              <div className="font-medium text-sm">Snooze Duration</div>
            </div>
            <Select
              value={snoozeDuration.toString()}
              onValueChange={(value) => {
                updateSettingsMutation.mutate({
                  id: settings.id,
                  data: { snooze_duration: parseInt(value) }
                });
              }}
            >
              <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="180">3 hours</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="360">6 hours</SelectItem>
                <SelectItem value="720">12 hours</SelectItem>
                <SelectItem value="1440">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 text-[var(--text-secondary)] flex items-center justify-center text-xs font-bold">
                Az
              </div>
              <div className="font-medium text-sm">Sort Games By</div>
            </div>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                updateSettingsMutation.mutate({
                  id: settings.id,
                  data: { sort_by: value }
                });
              }}
            >
              <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="reminders">Number of Reminders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isPremium && (
          <>
            <button
              onClick={() => navigate(createPageUrl("QuietTimeList"))}
              className="w-full bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 hover:bg-[var(--surface-elevated)] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
                <div className="text-left">
                  <div className="font-medium text-sm">Quiet Time Periods</div>
                  <div className="text-xs text-[var(--text-secondary)]">Manage notification blackouts</div>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)] rotate-180" />
            </button>

            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
              <button
                onClick={handleExport}
                className="w-full p-4 hover:bg-[var(--surface-elevated)] transition-colors flex items-center gap-3"
              >
                <Download className="w-5 h-5 text-[var(--text-secondary)]" />
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">Export Configuration</div>
                  <div className="text-xs text-[var(--text-secondary)]">Save your data locally</div>
                </div>
              </button>
              
              <div className="border-t border-[var(--border)]">
                <label className="w-full p-4 hover:bg-[var(--surface-elevated)] transition-colors flex items-center gap-3 cursor-pointer">
                  <Upload className="w-5 h-5 text-[var(--text-secondary)]" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">Import Configuration</div>
                    <div className="text-xs text-[var(--text-secondary)]">Restore from backup</div>
                  </div>
                  <input
                    type="file"
                    accept="application/json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </>
        )}

        <button
          onClick={() => navigate(createPageUrl("Help"))}
          className="w-full bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 hover:bg-[var(--surface-elevated)] transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[var(--text-secondary)]" />
            <div className="text-left">
              <div className="font-medium text-sm">Help</div>
              <div className="text-xs text-[var(--text-secondary)]">How to use GamePulse</div>
            </div>
          </div>
          <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)] rotate-180" />
        </button>

        <button
          onClick={() => navigate(createPageUrl("About"))}
          className="w-full bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 hover:bg-[var(--surface-elevated)] transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-[var(--text-secondary)]" />
            <div className="text-left">
              <div className="font-medium text-sm">About</div>
              <div className="text-xs text-[var(--text-secondary)]">Version & info</div>
            </div>
          </div>
          <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)] rotate-180" />
        </button>
      </div>
    </div>
  );
}
