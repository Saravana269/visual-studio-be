
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

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get screen data
  const { screens, isLoading, refetch } = useScreenData(widgetId);
  
  // Get screen actions
  const { createScreen, updateScreen, deleteScreen } = useScreenActions({
    widgetId,
    onSuccess: refetch
  });
  
  // Screen navigation
  const navigation = useScreenNavigation({ screens });

  // Handle opening create dialog
  const handleOpenCreateDialog = () => {
    setFormData({
      name: "",
      description: "",
      framework_type: "Multiple Options",
    });
    setIsCreateDialogOpen(true);
  };

  // Handle opening edit dialog
  const handleOpenEditDialog = () => {
    if (!navigation.activeScreen) return;
    
    setFormData({
      name: navigation.activeScreen.name,
      description: navigation.activeScreen.description || "",
      framework_type: navigation.activeScreen.framework_type || "Multiple Options",
      metadata: navigation.activeScreen.metadata
    });
    setIsEditDialogOpen(true);
  };

  // Handle creating a new screen
  const handleCreateScreen = async () => {
    const result = await createScreen(formData);
    if (result) {
      setIsCreateDialogOpen(false);
      // Navigate to the newly created screen after refetching data
      await refetch();
      if (screens.length > 0) {
        navigation.goToScreenByIndex(screens.length - 1);
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

  return {
    screens,
    isLoading,
    formData,
    setFormData,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCreateScreen,
    handleUpdateScreen,
    handleDeleteScreen,
    ...navigation
  };
}
