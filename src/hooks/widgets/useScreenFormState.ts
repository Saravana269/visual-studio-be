
import { useState } from "react";
import { ScreenFormData } from "@/types/screen";

export function useScreenFormState() {
  // Screen form data state with standardized metadata
  const [formData, setFormData] = useState<ScreenFormData>({
    name: "",
    description: "",
    framework_type: "Multiple Options",
    metadata: {
      options: []
    }
  });

  // Update form data when active screen changes
  const updateFormDataFromScreen = (activeScreen: any) => {
    if (!activeScreen) return;
    
    setFormData({
      name: activeScreen.name,
      description: activeScreen.description || "",
      framework_type: activeScreen.framework_type || "Multiple Options",
      metadata: standardizeMetadata(activeScreen.framework_type, activeScreen.metadata)
    });
  };

  // Standardize metadata based on framework type
  const standardizeMetadata = (frameworkType: string, oldMetadata: any = {}) => {
    const metadata = { ...oldMetadata } || {};
    
    switch (frameworkType) {
      case "Multiple Options":
      case "Radio Button":
        // Convert old field_options to options
        return { 
          options: metadata.options || metadata.field_options || [] 
        };
        
      case "Slider":
        // Convert old range_min, range_max, range_step to min, max, step
        return { 
          min: metadata.min ?? metadata.range_min ?? 0,
          max: metadata.max ?? metadata.range_max ?? 100,
          step: metadata.step ?? metadata.range_step ?? 1 
        };
        
      case "Yes / No":
        return { 
          value: metadata.value || null 
        };
        
      case "Information":
        // Convert old information to text
        return { 
          text: metadata.text || metadata.information || "" 
        };
        
      case "Image Upload":
        return { 
          image_url: metadata.image_url || "" 
        };
        
      case "COE Manager":
        return { 
          coe_id: metadata.coe_id || null 
        };
        
      default:
        return metadata;
    }
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
    
    // Standardize metadata before saving
    if (updatedData.framework_type || updatedData.metadata) {
      updatedFormData.metadata = standardizeMetadata(
        updatedData.framework_type || formData.framework_type,
        updatedData.metadata || formData.metadata
      );
    }
    
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
