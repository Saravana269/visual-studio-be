
import { ScreenFormData } from "@/types/screen";
import { useScreenActions } from "./useScreenActions";
import { useScreenCreation } from "./useScreenCreation";
import { useScreenDeletion } from "./useScreenDeletion";
import { useScreenUpdate } from "./useScreenUpdate";
import { useScreenStepNavigation } from "./useScreenStepNavigation";

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
  // Get all specialized hooks
  const { isActionLoading } = useScreenActions({
    widgetId,
    onSuccess: refetch
  });
  
  const { handleCreateEmptyScreen, isCreating } = useScreenCreation({
    widgetId,
    refetch,
    goToScreenByIndex
  });
  
  const { handleUpdateScreen, isUpdating } = useScreenUpdate({
    widgetId,
    refetch
  });
  
  const { handleDeleteScreen, isDeleting } = useScreenDeletion({
    widgetId,
    refetch,
    goToScreenByIndex,
    setIsDeleteDialogOpen
  });
  
  const { currentScreenId, handleStepSave, isStepSaving } = useScreenStepNavigation({
    widgetId,
    refetch,
    activeScreenId
  });

  // Combine all loading states
  const combinedLoadingState = isActionLoading || isCreating || isUpdating || isDeleting || isStepSaving;
  
  return {
    isActionLoading: combinedLoadingState,
    currentScreenId,
    handleCreateEmptyScreen,
    handleUpdateScreen: () => handleUpdateScreen(activeScreenId, formData),
    handleDeleteScreen: (screens: any[], activeScreenIndex: number) => 
      handleDeleteScreen(activeScreenId, screens, activeScreenIndex),
    handleStepSave,
    updateScreen: handleUpdateScreen
  };
}
