import { useState, useCallback } from "react";

export interface SystemNotification {
  id: string;
  message: string;
  type: "info" | "success" | "alert";
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  const addSystemNotification = useCallback(
    (message: string, type: "info" | "success" | "alert" = "info") => {
      const newNotif: SystemNotification = {
        id: "notif-" + Date.now(),
        message,
        type,
      };
      setNotifications((prev) => [newNotif, ...prev].slice(0, 4));

      // Auto-clear notification after 4.5 seconds to conserve memory
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
      }, 4500);
    },
    []
  );

  return {
    notifications,
    addSystemNotification,
  };
}
