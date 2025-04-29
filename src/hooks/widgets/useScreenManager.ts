
import { useState } from "react";
import { useScreenData } from "./useScreenData";
import { useScreenActions } from "./useScreenActions";
import { useScreenNavigation } from "./useScreenNavigation";
import { ScreenFormData } from "@/types/screen";

export function useScreenManager(widgetId: string | undefined) {
  // Screen form data state
  const [formData, setFormData] = useState<ScreenFormData>({
    name: "",
    description: "",
    framework_type: "Multiple Options",
  });

  // Dialog state for edit and delete operations only
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get screen data
  const { screens, isLoading, refetch } = useScreenData(widgetId);
  
  // Get screen actions
  const { createScreen, updateScreen, deleteScreen, isActionLoading } = useScreenActions({
    widgetId,
    onSuccess: refetch
  });
  
  // Screen navigation
  const navigation = useScreenNavigation({ screens });

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
      await refetch();
      if (screens.length > 0) {
        navigation.goToScreenByIndex(screens.length);
      }
    }
  };

  // Handle updating a screen
  const handleUpdateScreen = async () => {
    if (!navigation.activeScreen?.id) return;
    
    const success = await updateScreen(navigation.activeScreen.id, formData);
    if (success) {
      setIsEditDialogOpen(false);
      await refetch();
    }
  };

  // Handle direct inline update of a screen
  const handleInlineUpdate = async (updatedData: Partial<ScreenFormData>) => {
    if (!navigation.activeScreen?.id) return;
    
    // Update only the specific fields that were changed
    const updatedFormData = {
      ...formData,
      ...updatedData
    };
    
    // Update component state immediately for responsiveness
    setFormData(updatedFormData);
    
    // Send update to server
    await updateScreen(navigation.activeScreen.id, updatedFormData);
  };

  // Handle deleting a screen
  const handleDeleteScreen = async () => {
    if (!navigation.activeScreen?.id) return;
    
    const success = await deleteScreen(navigation.activeScreen.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      await refetch();
      // Navigate to previous or first screen
      if (screens.length > 0) {
        if (navigation.activeScreenIndex > 0) {
          navigation.goToScreenByIndex(navigation.activeScreenIndex - 1);
        } else {
          navigation.goToScreenByIndex(0);
        }
      }
    }
  };

  // Update form data when active screen changes
  const updateFormDataFromScreen = () => {
    if (!navigation.activeScreen) return;
    
    setFormData({
      name: navigation.activeScreen.name,
      description: navigation.activeScreen.description || "",
      framework_type: navigation.activeScreen.framework_type || "Multiple Options",
      metadata: navigation.activeScreen.metadata
    });
  };

  // Initialize form data when active screen changes
  useState(() => {
    if (navigation.activeScreen) {
      updateFormDataFromScreen();
    }
  });

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
    handleDeleteScreen,
    updateFormDataFromScreen,
    ...navigation
  };
}
