
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseAutosaveProps {
  data: any;
  onSave: (data: any) => void;
  enabled: boolean;
  delay?: number;
  notificationInterval?: number;
}

export function useAutosave({
  data,
  onSave,
  enabled,
  delay = 5000,
  notificationInterval = 10000
}: UseAutosaveProps) {
  const { toast } = useToast();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastNotification, setLastNotification] = useState<Date | null>(null);

  // Handle autosave with improved notification handling
  useEffect(() => {
    if (!enabled) return;

    // Clear any existing timeout
    if (saveTimeout) clearTimeout(saveTimeout);

    // Set a new timeout with the specified delay
    const timeout = setTimeout(() => {
      onSave(data);
      
      // Update last saved timestamp
      const now = new Date();
      setLastSaved(now);
      
      // Only show notification if it's been more than the notification interval since the last one
      if (!lastNotification || (now.getTime() - lastNotification.getTime() > notificationInterval)) {
        setLastNotification(now);
      }
    }, delay);

    setSaveTimeout(timeout);

    // Cleanup
    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [data, enabled, onSave, lastNotification, delay, notificationInterval]);

  return { lastSaved };
}
