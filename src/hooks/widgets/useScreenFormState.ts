
import { useState } from "react";
import { ScreenFormData } from "@/types/screen";
import { useFrameworkTypeActions } from "./useFrameworkTypeActions";

export function useScreenFormState() {
  // Framework type actions
  const { getFrameworkTypeByScreenId } = useFrameworkTypeActions();
  
  // Screen form data state with standardized metadata - now with null default framework_type
  const [formData, setFormData] = useState<ScreenFormData>({
    name: "",
    description: "",
    framework_type: null,
    metadata: {}
  });

  // Update form data when active screen changes
  const updateFormDataFromScreen = async (activeScreen: any) => {
    if (!activeScreen) return;
    
    // Try to get framework type data from framework_types table
    let metadataFromFramework = {};
    if (activeScreen.framework_id) {
      const frameworkData = await getFrameworkTypeByScreenId(activeScreen.id);
      if (frameworkData) {
        metadataFromFramework = frameworkData.property_values || {};
      }
    }
    
    // Fall back to screen.metadata if no framework data found
    const metadata = Object.keys(metadataFromFramework).length > 0 
      ? metadataFromFramework 
      : standardizeMetadata(activeScreen.framework_type || null, activeScreen.metadata);
    
    setFormData({
      name: activeScreen.name,
      description: activeScreen.description || "",
      framework_type: activeScreen.framework_type || null,
      metadata: metadata
    });
  };

  // Standardize metadata based on framework type
  const standardizeMetadata = (frameworkType: string | null, oldMetadata: any = {}) => {
    // Initialize metadata with default empty object if undefined
    const metadata = oldMetadata || {};
    
    // If framework type is null, return empty object
    if (!frameworkType) return {};
    
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

  // Convert screen metadata to framework property values
  const metadataToPropertyValues = (frameworkType: string | null, metadata: any = {}) => {
    // Return the standardized metadata as property values
    return standardizeMetadata(frameworkType, metadata);
  };

  // Handle direct inline update of a screen
  const handleInlineUpdate = async (
    updateScreen: (id: string, data: Partial<ScreenFormData>, createFramework?: boolean) => Promise<boolean>, 
    screenId: string | undefined, 
    updatedData: Partial<ScreenFormData>,
    createFramework: boolean = false
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
    await updateScreen(screenId, updatedFormData, createFramework);
  };

  return {
    formData,
    setFormData,
    updateFormDataFromScreen,
    handleInlineUpdate,
    metadataToPropertyValues
  };
}
