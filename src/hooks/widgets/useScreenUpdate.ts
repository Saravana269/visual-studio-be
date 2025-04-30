
import { useState } from "react";
import { ScreenFormData } from "@/types/screen";
import { useScreenActions } from "./useScreenActions";
import { useToast } from "@/hooks/use-toast";

interface UseScreenUpdateProps {
  widgetId: string | undefined;
  refetch: () => Promise<any>;
}

export function useScreenUpdate({
  widgetId,
  refetch
}: UseScreenUpdateProps) {
  const { updateScreen } = useScreenActions({
    widgetId,
    onSuccess: refetch
  });
  
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Handle updating a screen
  const handleUpdateScreen = async (activeScreenId: string | null, formData: ScreenFormData) => {
    if (!activeScreenId) return;
    
    setIsUpdating(true);
    
    try {
      await updateScreen(activeScreenId, formData);
    } catch (error) {
      console.error("Error updating screen:", error);
      toast({
        title: "Error",
        description: "Failed to update the screen",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    handleUpdateScreen,
    isUpdating
  };
}
