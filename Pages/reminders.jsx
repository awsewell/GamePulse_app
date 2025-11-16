import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Grid3x3, List } from "lucide-react";
import ReminderCard from "../components/reminders/ReminderCard";
import ReminderListItem from "../components/reminders/ReminderListItem";
import UpgradePrompt from "../components/shared/UpgradePrompt";

export default function Reminders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const games = await base44.entities.Game.list();
      return games.find(g => g.id === gameId);
    },
    enabled: !!gameId,
  });

  const { data: reminders = [] } = useQuery({
    queryKey: ['reminders', gameId],
    queryFn: async () => {
      const all = await base44.entities.Reminder.list();
      return all.filter(r => r.game_id === gameId);
    },
    initialData: [],
  });

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

  const deleteReminderMutation = useMutation({
    mutationFn: (id) => base44.entities.Reminder.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const isPremium = settings?.is_premium || false;
  const viewMode = settings?.view_mode || "card";
  const totalReminders = reminders.length;
  const canAddReminder = isPremium || totalReminders < 2;

  const toggleView = () => {
    if (settings) {
      updateSettingsMutation.mutate({
        id: settings.id,
        data: { view_mode: viewMode === "card" ? "list" : "card" }
      });
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(createPageUrl("Games"))}
              className="w-10 h-10 rounded-xl hover:bg-[var(--surface)]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-light tracking-tight truncate">{game.name}</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleView}
              className="w-10 h-10 rounded-xl hover:bg-[var(--surface)]"
            >
              {viewMode === "card" ? (
                <List className="w-5 h-5" />
              ) : (
                <Grid3x3 className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {!isPremium && totalReminders >= 2 && (
          <UpgradePrompt message="Unlock unlimited reminders" className="mb-6" />
        )}

        {reminders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <p className="text-[var(--text-secondary)] mb-6">No reminders yet</p>
            <Button
              onClick={() => navigate(createPageUrl(`ReminderEditor?gameId=${gameId}`))}
              disabled={!canAddReminder}
              className="bg-[var(--primary-blue)] hover:bg-[var(--blue-hover)] rounded-xl px-6"
            >
              Add Your First Reminder
            </Button>
          </div>
        ) : (
          <>
            {viewMode === "card" ? (
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onDelete={() => deleteReminderMutation.mutate(reminder.id)}
                    gameId={gameId}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <ReminderListItem
                    key={reminder.id}
                    reminder={reminder}
                    onDelete={() => deleteReminderMutation.mutate(reminder.id)}
                    gameId={gameId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {canAddReminder && (
        <div className="fixed bottom-6 right-6">
          <Button
            size="icon"
            onClick={() => navigate(createPageUrl(`ReminderEditor?gameId=${gameId}`))}
            className="w-14 h-14 rounded-2xl bg-[var(--primary-blue)] hover:bg-[var(--blue-hover)] shadow-2xl"
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
}
