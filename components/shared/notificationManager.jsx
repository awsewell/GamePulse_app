import { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function NotificationManager() {
  const { data: reminders = [] } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => base44.entities.Reminder.list(),
    initialData: [],
    refetchInterval: 10000, // Check every 10 seconds
  });

  const { data: settings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const allSettings = await base44.entities.AppSettings.list();
      return allSettings[0];
    },
  });

  useEffect(() => {
    const requestPermission = async () => {
      if ("Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }
    };
    requestPermission();
  }, []);

  useEffect(() => {
    if (!reminders.length || Notification.permission !== "granted") return;

    const checkReminders = () => {
      const now = Date.now();
      
      reminders.forEach((reminder) => {
        if (!reminder.next_trigger_time) return;
        
        const triggerTime = new Date(reminder.next_trigger_time).getTime();
        const diff = triggerTime - now;
        
        // If within 5 seconds of trigger time and not yet triggered
        if (diff <= 5000 && diff > -5000) {
          const notificationKey = `notif_${reminder.id}_${triggerTime}`;
          
          // Check if we already sent this notification
          if (localStorage.getItem(notificationKey)) return;
          
          // Mark as sent
          localStorage.setItem(notificationKey, "sent");
          
          // Send notification
          const notification = new Notification(`${reminder.name}`, {
            body: reminder.type === "interval" 
              ? "Your interval timer has expired!" 
              : "It's time for your scheduled reminder!",
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: reminder.id,
            requireInteraction: true,
          });

          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        }
      });
    };

    const interval = setInterval(checkReminders, 1000);
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [reminders]);

  return null;
}
