
import { ScreenFormData } from "@/types/screen";
import { useScreenActions } from "./useScreenActions";

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
  const { createScreen, updateScreen, deleteScreen, isActionLoading } = useScreenActions({
    widgetId,
    onSuccess: refetch
  });

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
    handleCreateEmptyScreen,
    handleUpdateScreen,
    handleDeleteScreen,
    updateScreen
  };
}
