
import { useState } from "react";
import { ScreenFormData } from "@/types/screen";

export function useScreenFormState() {
  // Screen form data state
  const [formData, setFormData] = useState<ScreenFormData>({
    name: "",
    description: "",
    framework_type: "Multiple Options",
  });

  // Update form data when active screen changes
  const updateFormDataFromScreen = (activeScreen: any) => {
    if (!activeScreen) return;
    
    setFormData({
      name: activeScreen.name,
      description: activeScreen.description || "",
      framework_type: activeScreen.framework_type || "Multiple Options",
      metadata: activeScreen.metadata
    });
  };

  // Handle direct inline update of a screen
  const handleInlineUpdate = async (
    updateScreen: (id: string, data: Partial<ScreenFormData>) => Promise<boolean>, 
    screenId: string | undefined, 
    updatedData: Partial<ScreenFormData>
  ) => {
    if (!screenId) return;
    
    // Update only the specific fields that were changed
    const updatedFormData = {
      ...formData,
      ...updatedData
    };
    
    // Update component state immediately for responsiveness
    setFormData(updatedFormData);
    
    // Send update to server
    await updateScreen(screenId, updatedFormData);
  };

  return {
    formData,
    setFormData,
    updateFormDataFromScreen,
    handleInlineUpdate
  };
}
