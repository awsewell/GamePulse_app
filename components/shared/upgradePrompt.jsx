import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpgradePrompt({ message, className = "" }) {
  const navigate = useNavigate();

  return (
    <div className={`bg-gradient-to-r from-[var(--primary-blue)] to-blue-600 rounded-2xl p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm mb-1">{message}</p>
          <p className="text-white text-opacity-80 text-xs">One-time purchase</p>
        </div>
        <Button
          size="sm"
          onClick={() => navigate(createPageUrl("Settings"))}
          className="bg-white text-[var(--primary-blue)] hover:bg-gray-100 rounded-lg px-4 flex-shrink-0"
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
}
