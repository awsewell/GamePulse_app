import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import QuietTimeCard from "../components/quiettime/QuietTimeCard";

export default function QuietTimeList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: quietTimes = [] } = useQuery({
    queryKey: ['quietTimes'],
    queryFn: () => base44.entities.QuietTime.list(),
    initialData: [],
  });

  const { data: settings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const allSettings = await base44.entities.AppSettings.list();
      return allSettings[0];
    },
  });

  const deleteQuietTimeMutation = useMutation({
    mutationFn: (id) => base44.entities.QuietTime.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quietTimes'] });
    },
  });

  const viewMode = settings?.view_mode || "card";

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
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
            <h1 className="text-2xl font-light tracking-tight">Quiet Time</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {quietTimes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <p className="text-[var(--text-secondary)] mb-6">No quiet time periods set</p>
            <Button
              onClick={() => navigate(createPageUrl("QuietTimeEditor"))}
              className="bg-[var(--primary-blue)] hover:bg-[var(--blue-hover)] rounded-xl px-6"
            >
              Add Quiet Time
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {quietTimes.map((quietTime) => (
              <QuietTimeCard
                key={quietTime.id}
                quietTime={quietTime}
                onDelete={() => deleteQuietTimeMutation.mutate(quietTime.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6">
        <Button
          size="icon"
          onClick={() => navigate(createPageUrl("QuietTimeEditor"))}
          className="w-14 h-14 rounded-2xl bg-[var(--primary-blue)] hover:bg-[var(--blue-hover)] shadow-2xl"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
