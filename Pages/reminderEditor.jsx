import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ReminderEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');
  const reminderId = urlParams.get('reminderId');

  const [formData, setFormData] = useState({
    name: "",
    type: "interval",
    interval_hours: 0,
    interval_minutes: 30,
    fixed_type: "daily",
    fixed_time: "12:00",
    fixed_days: [],
    timezone: "local",
    milestone_enabled: false,
    milestone_progress: 0,
    milestone_target: 10,
    notification_preference: "default"
  });

  const { data: reminder } = useQuery({
    queryKey: ['reminder', reminderId],
    queryFn: async () => {
      const all = await base44.entities.Reminder.list();
      return all.find(r => r.id === reminderId);
    },
    enabled: !!reminderId,
  });

  const { data: settings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const allSettings = await base44.entities.AppSettings.list();
      return allSettings[0];
    },
  });

  useEffect(() => {
    if (reminder) {
      setFormData({
        name: reminder.name || "",
        type: reminder.type || "interval",
        interval_hours: reminder.interval_hours || 0,
        interval_minutes: reminder.interval_minutes || 30,
        fixed_type: reminder.fixed_type || "daily",
        fixed_time: reminder.fixed_time || "12:00",
        fixed_days: reminder.fixed_days || [],
        timezone: reminder.timezone || "local",
        milestone_enabled: reminder.milestone_enabled || false,
        milestone_progress: reminder.milestone_progress || 0,
        milestone_target: reminder.milestone_target || 10,
        notification_preference: reminder.notification_preference || "default"
      });
    }
  }, [reminder]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const now = new Date();
      let nextTrigger;

      if (data.type === "interval") {
        const totalMinutes = (data.interval_hours || 0) * 60 + (data.interval_minutes || 0);
        nextTrigger = new Date(now.getTime() + totalMinutes * 60 * 1000).toISOString();
      } else {
        const [hours, minutes] = data.fixed_time.split(':');
        const targetDate = new Date();
        targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        if (data.fixed_type === "daily") {
          if (targetDate <= now) {
            targetDate.setDate(targetDate.getDate() + 1);
          }
        } else {
          while (!data.fixed_days.includes(targetDate.getDay()) || targetDate <= now) {
            targetDate.setDate(targetDate.getDate() + 1);
          }
        }
        
        nextTrigger = targetDate.toISOString();
      }

      const reminderData = {
        ...data,
        game_id: gameId,
        next_trigger_time: nextTrigger,
        last_reset_time: now.toISOString()
      };

      if (reminderId) {
        return base44.entities.Reminder.update(reminderId, reminderData);
      } else {
        return base44.entities.Reminder.create(reminderData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      navigate(createPageUrl(`Reminders?gameId=${gameId}`));
    },
  });

  const isPremium = settings?.is_premium || false;

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      fixed_days: prev.fixed_days.includes(day)
        ? prev.fixed_days.filter(d => d !== day)
        : [...prev.fixed_days, day]
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    saveMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-6">
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(createPageUrl(`Reminders?gameId=${gameId}`))}
              className="w-10 h-10 rounded-xl hover:bg-[var(--surface)]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-light tracking-tight">
              {reminderId ? "Edit Reminder" : "New Reminder"}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
            <Label className="text-[var(--text)] mb-2 block">Reminder Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Daily reset, Boss spawn, etc."
              className="bg-[var(--background)] border-[var(--border)]"
            />
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
            <Label className="text-[var(--text)] mb-3 block">Reminder Type</Label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setFormData(prev => ({ ...prev, type: "interval" }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === "interval"
                    ? "border-[var(--primary-blue)] bg-[var(--primary-blue)] bg-opacity-10"
                    : "border-[var(--border)] hover:bg-[var(--background)]"
                }`}
              >
                <div className="font-medium text-sm">Interval</div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">Repeats after time</div>
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, type: "fixed" }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === "fixed"
                    ? "border-[var(--primary-blue)] bg-[var(--primary-blue)] bg-opacity-10"
                    : "border-[var(--border)] hover:bg-[var(--background)]"
                }`}
              >
                <div className="font-medium text-sm">Fixed</div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">Specific time</div>
              </button>
            </div>

            {formData.type === "interval" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[var(--text)] text-xs mb-2 block">Hours (0-72)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="72"
                      value={formData.interval_hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, interval_hours: parseInt(e.target.value) || 0 }))}
                      className="bg-[var(--background)] border-[var(--border)]"
                    />
                  </div>
                  <div>
                    <Label className="text-[var(--text)] text-xs mb-2 block">Minutes (0-59)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={formData.interval_minutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, interval_minutes: parseInt(e.target.value) || 0 }))}
                      className="bg-[var(--background)] border-[var(--border)]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, fixed_type: "daily" }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.fixed_type === "daily"
                        ? "border-[var(--primary-blue)] bg-[var(--primary-blue)] bg-opacity-10"
                        : "border-[var(--border)] hover:bg-[var(--background)]"
                    }`}
                  >
                    <div className="text-sm">Daily</div>
                  </button>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, fixed_type: "weekly" }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.fixed_type === "weekly"
                        ? "border-[var(--primary-blue)] bg-[var(--primary-blue)] bg-opacity-10"
                        : "border-[var(--border)] hover:bg-[var(--background)]"
                    }`}
                  >
                    <div className="text-sm">Weekly</div>
                  </button>
                </div>

                <div>
                  <Label className="text-[var(--text)] text-xs mb-2 block">Time</Label>
                  <Input
                    type="time"
                    value={formData.fixed_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, fixed_time: e.target.value }))}
                    className="bg-[var(--background)] border-[var(--border)]"
                  />
                </div>

                {formData.fixed_type === "weekly" && (
                  <div>
                    <Label className="text-[var(--text)] text-xs mb-2 block">Days of Week</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {DAYS_OF_WEEK.map((day, index) => (
                        <button
                          key={day}
                          onClick={() => toggleDay(index)}
                          className={`p-2 rounded-lg border-2 text-xs transition-all ${
                            formData.fixed_days.includes(index)
                              ? "border-[var(--primary-blue)] bg-[var(--primary-blue)] bg-opacity-10"
                              : "border-[var(--border)] hover:bg-[var(--background)]"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-[var(--text)] text-xs mb-2 block">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Time</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-[var(--text)] block">Track as Milestone</Label>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Count completions</p>
              </div>
              <Switch
                checked={formData.milestone_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, milestone_enabled: checked }))}
              />
            </div>

            {formData.milestone_enabled && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[var(--text)] text-xs mb-2 block">Progress</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.milestone_progress}
                      onChange={(e) => setFormData(prev => ({ ...prev, milestone_progress: parseInt(e.target.value) || 0 }))}
                      className="bg-[var(--background)] border-[var(--border)]"
                    />
                  </div>
                  <div>
                    <Label className="text-[var(--text)] text-xs mb-2 block">Target</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.milestone_target}
                      onChange={(e) => setFormData(prev => ({ ...prev, milestone_target: parseInt(e.target.value) || 1 }))}
                      className="bg-[var(--background)] border-[var(--border)]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {isPremium && (
            <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
              <Label className="text-[var(--text)] mb-3 block">Quiet Time Behavior</Label>
              <Select
                value={formData.notification_preference}
                onValueChange={(value) => setFormData(prev => ({ ...prev, notification_preference: value }))}
              >
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Use Quiet Time Settings</SelectItem>
                  <SelectItem value="silent">Always Silent</SelectItem>
                  <SelectItem value="suppress">Always Suppress</SelectItem>
                  <SelectItem value="delay">Always Delay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl(`Reminders?gameId=${gameId}`))}
              className="flex-1 border-[var(--border)] rounded-xl h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name.trim()}
              className="flex-1 bg-[var(--primary-blue)] hover:bg-[var(--blue-hover)] rounded-xl h-12"
            >
              Save Reminder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
