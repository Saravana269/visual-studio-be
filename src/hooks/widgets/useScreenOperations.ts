
import { useState, useEffect } from "react";
import { ScreenFormData } from "@/types/screen";
import { useScreenActions } from "./useScreenActions";
import { useToast } from "@/hooks/use-toast";

interface UseScreenOperationsProps {
  widgetId: string | undefined;
  refetch: () => Promise<any>;
  formData: ScreenFormData;
  activeScreenId: string | null;
  goToScreenByIndex: (index: number) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

export function useScreenOperations({
  widgetId,
  refetch,
  formData,
  activeScreenId,
  goToScreenByIndex,
  setIsDeleteDialogOpen
}: UseScreenOperationsProps) {
  // Get screen actions
  const { createScreen, updateScreen, updateScreenByStep, deleteScreen, isActionLoading } = useScreenActions({
    widgetId,
    onSuccess: refetch
  });
  
  const { toast } = useToast();
  const [currentScreenId, setCurrentScreenId] = useState<string | null>(activeScreenId);
  
  // Track the step-by-step screen creation
  useEffect(() => {
    if (activeScreenId !== currentScreenId) {
      setCurrentScreenId(activeScreenId);
    }
  }, [activeScreenId]);

  // Handle creating a new empty screen directly
  const handleCreateEmptyScreen = async () => {
    const emptyScreenData = {
      name: "Untitled",
      description: "",
      framework_type: "Multiple Options",
    };
    
    const result = await createScreen(emptyScreenData);
    if (result) {
      // Refetch screens and navigate to the newly created screen
      const updatedData = await refetch();
      if (updatedData?.length > 0) {
        goToScreenByIndex(updatedData.length - 1);
      }
    }
  };

  // Handle updating a screen
  const handleUpdateScreen = async () => {
    if (!activeScreenId) return;
    
    await updateScreen(activeScreenId, formData);
  };

  // Handle updating a screen by step
  const handleStepSave = async (step: number, data: Partial<ScreenFormData>, createFramework: boolean = false) => {
    try {
      const result = await updateScreenByStep(currentScreenId, step, data, createFramework);
      
      if (result.success) {
        // If this is step 1 and we're creating a new screen, update the current screen ID
        if (step === 1 && !currentScreenId && result.screenId) {
          setCurrentScreenId(result.screenId);
          
          // Also refetch to update the list and navigate to the new screen
          const screens = await refetch();
          if (screens?.length > 0) {
            const newScreenIndex = screens.findIndex((s: any) => s.id === result.screenId);
            if (newScreenIndex >= 0) {
              goToScreenByIndex(newScreenIndex);
            }
          }
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in step save:", error);
      toast({
        title: "Error",
        description: "Failed to save this step. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle deleting a screen
  const handleDeleteScreen = async (screens: any[], activeScreenIndex: number) => {
    if (!activeScreenId) return;
    
    const success = await deleteScreen(activeScreenId);
    if (success) {
      setIsDeleteDialogOpen(false);
      await refetch();
      // Navigate to previous or first screen
      if (screens.length > 0) {
        if (activeScreenIndex > 0) {
          goToScreenByIndex(activeScreenIndex - 1);
        } else {
          goToScreenByIndex(0);
        }
      }
    }
  };
  
  return {
    isActionLoading,
    currentScreenId,
    handleCreateEmptyScreen,
    handleUpdateScreen,
    handleDeleteScreen,
    handleStepSave,
    updateScreen
  };
}
