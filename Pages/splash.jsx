import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Gamepad2 } from "lucide-react";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(createPageUrl("Games"));
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
        <div className="w-24 h-24 rounded-3xl bg-[var(--primary-blue)] flex items-center justify-center shadow-2xl">
          <Gamepad2 className="w-14 h-14 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-light tracking-tight text-[var(--text)]">
          GamePulse
        </h1>
        <div className="w-32 h-1 bg-[var(--primary-blue)] rounded-full animate-pulse" />
      </div>
    </div>
  );
}
