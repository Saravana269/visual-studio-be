
import { useState, useEffect } from "react";
import { useScreenData } from "./useScreenData";
import { useScreenNavigation } from "./useScreenNavigation";
import { useScreenFormState } from "./useScreenFormState";
import { useScreenDialogState } from "./useScreenDialogState";
import { useScreenOperations } from "./useScreenOperations";
import { ScreenFormData } from "@/types/screen";

export function useScreenManager(widgetId: string | undefined) {
  // Get screen data
  const { screens, isLoading, refetch } = useScreenData(widgetId);
  
  // Get screen navigation
  const navigation = useScreenNavigation({ screens });
  
  // Get form state management
  const { formData, setFormData, updateFormDataFromScreen, handleInlineUpdate: inlineUpdate } = useScreenFormState();
  
  // Get dialog state
  const { isEditDialogOpen, setIsEditDialogOpen, isDeleteDialogOpen, setIsDeleteDialogOpen } = useScreenDialogState();
  
  // Screen operations
  const { 
    isActionLoading,
    handleCreateEmptyScreen,
    handleUpdateScreen,
    handleDeleteScreen,
    updateScreen
  } = useScreenOperations({
    widgetId,
    refetch,
    formData,
    activeScreenId: navigation.activeScreenId,
    goToScreenByIndex: navigation.goToScreenByIndex,
    setIsDeleteDialogOpen
  });

  // Handle direct inline update of a screen
  const handleInlineUpdate = async (updatedData: Partial<ScreenFormData>) => {
    await inlineUpdate(updateScreen, navigation.activeScreen?.id, updatedData);
  };

  // Initialize form data when active screen changes
  useEffect(() => {
    if (navigation.activeScreen) {
      updateFormDataFromScreen(navigation.activeScreen);
    }
  }, [navigation.activeScreen]);

  return {
    screens,
    isLoading,
    isActionLoading,
    formData,
    setFormData,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleCreateEmptyScreen,
    handleUpdateScreen,
    handleInlineUpdate,
    handleDeleteScreen: () => handleDeleteScreen(screens, navigation.activeScreenIndex),
    updateFormDataFromScreen,
    ...navigation
  };
}
