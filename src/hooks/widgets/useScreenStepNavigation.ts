
import { useState, useEffect } from "react";
import { ScreenFormData } from "@/types/screen";
import { useScreenActions } from "./useScreenActions";
import { useToast } from "@/hooks/use-toast";

interface UseScreenStepNavigationProps {
  widgetId: string | undefined;
  refetch: () => Promise<any>;
  activeScreenId: string | null;
}

export function useScreenStepNavigation({
  widgetId,
  refetch,
  activeScreenId
}: UseScreenStepNavigationProps) {
  const { updateScreenByStep } = useScreenActions({
    widgetId,
    onSuccess: refetch
  });
  
  const { toast } = useToast();
  const [currentScreenId, setCurrentScreenId] = useState<string | null>(activeScreenId);
  const [isStepSaving, setIsStepSaving] = useState<boolean>(false);
  
  // Track the step-by-step screen creation
  useEffect(() => {
    if (activeScreenId !== currentScreenId) {
      setCurrentScreenId(activeScreenId);
    }
  }, [activeScreenId]);

  // Handle updating a screen by step
  const handleStepSave = async (step: number, data: Partial<ScreenFormData>, createFramework: boolean = false) => {
    setIsStepSaving(true);
    
    try {
      const result = await updateScreenByStep(currentScreenId, step, data, createFramework);
      
      if (result.success) {
        // If this is step 1 and we're creating a new screen, update the current screen ID
        if (step === 1 && !currentScreenId && result.screenId) {
          setCurrentScreenId(result.screenId);
          
          // Return the new screen ID for any additional processing by the caller
          return {
            success: true,
            screenId: result.screenId
          };
        }
        
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      console.error("Error in step save:", error);
      toast({
        title: "Error",
        description: "Failed to save this step. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsStepSaving(false);
    }
  };

  return {
    currentScreenId,
    handleStepSave,
    isStepSaving
  };
}
