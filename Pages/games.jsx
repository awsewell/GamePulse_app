import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Settings, Grid3x3, List, Moon, Sun } from "lucide-react";
import GameCard from "../components/games/GameCard";
import GameListItem from "../components/games/GameListItem";
import UpgradePrompt from "../components/shared/UpgradePrompt";
import NotificationManager from "../components/shared/NotificationManager";

export default function Games() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: games = [], isLoading: gamesLoading } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list(),
    initialData: [],
  });

  const { data: reminders = [] } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => base44.entities.Reminder.list(),
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

  const deleteGameMutation = useMutation({
    mutationFn: async (gameId) => {
      const gameReminders = reminders.filter(r => r.game_id === gameId);
      for (const reminder of gameReminders) {
        await base44.entities.Reminder.delete(reminder.id);
      }
      await base44.entities.Game.delete(gameId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const isPremium = settings?.is_premium || false;
  const viewMode = settings?.view_mode || "card";
  const theme = settings?.theme || "dark";
  const sortBy = settings?.sort_by || "alphabetical";

  const toggleTheme = () => {
    if (settings) {
      updateSettingsMutation.mutate({
        id: settings.id,
        data: { theme: theme === "dark" ? "light" : "dark" }
      });
    }
  };

  const toggleView = () => {
    if (settings) {
      updateSettingsMutation.mutate({
        id: settings.id,
        data: { view_mode: viewMode === "card" ? "list" : "card" }
      });
    }
  };

  const getReminderCount = (gameId) => {
    return reminders.filter(r => r.game_id === gameId).length;
  };

  const sortedGames = [...games].sort((a, b) => {
    if (sortBy === "alphabetical") {
      return a.name.localeCompare(b.name);
    } else {
      return getReminderCount(b.id) - getReminderCount(a.id);
    }
  });

  const canAddGame = isPremium || games.length < 1;

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <NotificationManager />
      
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light tracking-tight">Games</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl hover:bg-[var(--surface)]"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(createPageUrl("Settings"))}
                className="w-10 h-10 rounded-xl hover:bg-[var(--surface)]"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {!isPremium && games.length >= 1 && (
          <UpgradePrompt message="Unlock unlimited games" className="mb-6" />
        )}

        {gamesLoading ? (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            Loading...
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <p className="text-[var(--text-secondary)] mb-6">No games yet</p>
            <Link to={createPageUrl("GameSelection")}>
              <Button className="bg-[var(--primary-blue)] hover:bg-[var(--blue-hover)] rounded-xl px-6">
                Add Your First Game
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {viewMode === "card" ? (
              <div className="grid grid-cols-2 gap-4">
                {sortedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    reminderCount={getReminderCount(game.id)}
                    onDelete={() => deleteGameMutation.mutate(game.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedGames.map((game) => (
                  <GameListItem
                    key={game.id}
                    game={game}
                    reminderCount={getReminderCount(game.id)}
                    onDelete={() => deleteGameMutation.mutate(game.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {canAddGame && (
        <div className="fixed bottom-6 right-6">
          <Link to={createPageUrl("GameSelection")}>
            <Button
              size="icon"
              className="w-14 h-14 rounded-2xl bg-[var(--primary-blue)] hover:bg-[var(--blue-hover)] shadow-2xl"
            >
              <Plus className="w-6 h-6 text-white" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
