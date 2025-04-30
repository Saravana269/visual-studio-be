
import { ScreenFormData } from "@/types/screen";
import { useScreenActions } from "./useScreenActions";
import { useState } from "react";
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
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Get all specialized hooks
  const { createScreen, updateScreen, updateScreenByStep, deleteScreen, isActionLoading } = useScreenActions({
    widgetId,
    onSuccess: refetch
  });

  // Handle creating a new empty screen
  const handleCreateEmptyScreen = async () => {
    if (!widgetId) return;
    
    setIsCreating(true);
    
    try {
      const newScreen = await createScreen({
        name: "Untitled Screen",
        description: "",
        framework_type: ""
      });
      
      if (newScreen) {
        // Navigate to the new screen (it will be added at the end)
        await refetch();
        goToScreenByIndex(999); // Large number to ensure we go to the last screen
      }
    } catch (error) {
      console.error("Error creating screen:", error);
      toast({
        title: "Error",
        description: "Failed to create new screen",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Handle updating a screen
  const handleUpdateScreen = async () => {
    if (!activeScreenId) return false;
    
    try {
      return await updateScreen(activeScreenId, formData);
    } catch (error) {
      console.error("Error updating screen:", error);
      toast({
        title: "Error",
        description: "Failed to update the screen",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Handle deleting a screen
  const handleDeleteScreen = async (screens: any[], activeScreenIndex: number) => {
    if (!activeScreenId) return;
    
    try {
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
    } catch (error) {
      console.error("Error deleting screen:", error);
      toast({
        title: "Error",
        description: "Failed to delete the screen",
        variant: "destructive"
      });
    }
  };
  
  // Handle saving a step
  const handleStepSave = async (step: number, data: Partial<ScreenFormData>, createFramework: boolean = false) => {
    try {
      const result = await updateScreenByStep(activeScreenId, step, data, createFramework);
      return result.success;
    } catch (error) {
      console.error("Error in step save:", error);
      toast({
        title: "Error",
        description: "Failed to save this step.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Combine all loading states
  const combinedLoadingState = isActionLoading || isCreating;
  
  return {
    isActionLoading: combinedLoadingState,
    handleCreateEmptyScreen,
    handleUpdateScreen,
    handleDeleteScreen,
    handleStepSave,
    updateScreen: (id: string, data: Partial<ScreenFormData>) => updateScreen(id, data)
  };
}
