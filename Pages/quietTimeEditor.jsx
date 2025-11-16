import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function QuietTimeEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const quietTimeId = urlParams.get('id');

  const [formData, setFormData] = useState({
    name: "",
    start_time: "22:00",
    end_time: "08:00",
    days: [],
    behavior: "delay"
  });

  const { data: quietTime } = useQuery({
    queryKey: ['quietTime', quietTimeId],
    queryFn: async () => {
      const all = await base44.entities.QuietTime.list();
      return all.find(qt => qt.id === quietTimeId);
    },
    enabled: !!quietTimeId,
  });

  useEffect(() => {
    if (quietTime) {
      setFormData({
        name: quietTime.name || "",
        start_time: quietTime.start_time || "22:00",
        end_time: quietTime.end_time || "08:00",
        days: quietTime.days || [],
        behavior: quietTime.behavior || "delay"
      });
    }
  }, [quietTime]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (quietTimeId) {
        return base44.entities.QuietTime.update(quietTimeId, data);
      } else {
        return base44.entities.QuietTime.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quietTimes'] });
      navigate(createPageUrl("QuietTimeList"));
    },
  });

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || formData.days.length === 0) return;
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
              onClick={() => navigate(createPageUrl("QuietTimeList"))}
              className="w-10 h-10 rounded-xl hover:bg-[var(--surface)]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-light tracking-tight">
              {quietTimeId ? "Edit Quiet Time" : "New Quiet Time"}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
            <Label className="text-[var(--text)] mb-2 block">Profile Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Sleep time, Work hours, etc."
              className="bg-[var(--background)] border-[var(--border)]"
            />
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
            <Label className="text-[var(--text)] mb-3 block">Time Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[var(--text)] text-xs mb-2 block">Start Time</Label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                  className="bg-[var(--background)] border-[var(--border)]"
                />
              </div>
              <div>
                <Label className="text-[var(--text)] text-xs mb-2 block">End Time</Label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                  className="bg-[var(--background)] border-[var(--border)]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
            <Label className="text-[var(--text)] mb-3 block">Days of Week</Label>
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day, index) => (
                <button
                  key={day}
                  onClick={() => toggleDay(index)}
                  className={`p-3 rounded-xl border-2 text-xs transition-all ${
                    formData.days.includes(index)
                      ? "border-[var(--primary-blue)] bg-[var(--primary-blue)] bg-opacity-10"
                      : "border-[var(--border)] hover:bg-[var(--background)]"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
            <Label className="text-[var(--text)] mb-3 block">Notification Behavior</Label>
            <Select
              value={formData.behavior}
              onValueChange={(value) => setFormData(prev => ({ ...prev, behavior: value }))}
            >
              <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delay">Send at end of quiet time</SelectItem>
                <SelectItem value="suppress">Suppress notifications</SelectItem>
                <SelectItem value="silent">Silent notifications</SelectItem>
                <SelectItem value="manual">Manual per reminder</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              {formData.behavior === "delay" && "Notifications will be sent when quiet time ends"}
              {formData.behavior === "suppress" && "No notifications will be generated"}
              {formData.behavior === "silent" && "Notifications without sound or vibration"}
              {formData.behavior === "manual" && "Each reminder uses its own preference"}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("QuietTimeList"))}
              className="flex-1 border-[var(--border)] rounded-xl h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name.trim() || formData.days.length === 0}
              className="flex-1 bg-[var(--primary-blue)] hover:bg-[var(--blue-hover)] rounded-xl h-12"
            >
              Save Quiet Time
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
