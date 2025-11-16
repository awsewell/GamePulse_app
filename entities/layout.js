import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Layout({ children, currentPageName }) {
  const [theme, setTheme] = useState("dark");

  const { data: settings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const allSettings = await base44.entities.AppSettings.list();
      if (allSettings.length === 0) {
        return await base44.entities.AppSettings.create({
          theme: "dark",
          view_mode: "card",
          snooze_duration: 15,
          is_premium: false,
          sort_by: "alphabetical"
        });
      }
      return allSettings[0];
    },
    initialData: null,
  });

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme || "dark");
    }
  }, [settings]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <style>{`
        :root {
          --primary-blue: #2563EB;
          --blue-hover: #1D4ED8;
        }
        
        .dark {
          --background: #000000;
          --surface: #0A0A0A;
          --surface-elevated: #141414;
          --text: #FFFFFF;
          --text-secondary: #A3A3A3;
          --border: #1F1F1F;
        }
        
        .light {
          --background: #FFFFFF;
          --surface: #F8F8F8;
          --surface-elevated: #F1F1F1;
          --text: #000000;
          --text-secondary: #525252;
          --border: #E5E5E5;
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
      
      <div className="bg-[var(--background)] text-[var(--text)] min-h-screen transition-colors duration-300">
        {children}
      </div>
    </div>
  );
}
