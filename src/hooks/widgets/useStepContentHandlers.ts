
import { useState, useEffect } from "react";
import { ScreenFormData } from "@/types/screen";
import { useToast } from "@/hooks/use-toast";

interface UseStepContentHandlersProps {
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave?: () => void;
  autoSave?: boolean;
}

export function useStepContentHandlers({
  formData,
  setFormData,
  onSave,
  autoSave = false
}: UseStepContentHandlersProps) {
  const { toast } = useToast();
  
  // Handle form field changes - updated to match expected signature
  const handleFormChange = (field: keyof ScreenFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If autoSave is enabled, trigger save after a short delay
    if (autoSave && onSave) {
      const timer = setTimeout(() => {
        onSave();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  };

  // Handle framework type change
  const handleFrameworkChange = (value: string | null) => {
    // When framework type changes, reset metadata to avoid mixing configuration
    let newMetadata = {};
    
    // Set default values based on framework type
    switch (value) {
      case "Multiple Options":
      case "Radio Button":
        newMetadata = { options: [] };
        break;
      case "Slider":
        newMetadata = { min: 0, max: 100, step: 1 };
        break;
      case "Information":
        newMetadata = { text: "" };
        break;
      case "Yes / No":
        newMetadata = { value: null };
        break;
      case "Image Upload":
        newMetadata = { image_url: "" };
        break;
      case "COE Manager":
        newMetadata = { coe_id: null };
        break;
      default:
        newMetadata = {};
        break;
    }
    
    // Update form data with new framework type and clean metadata
    setFormData(prev => ({
      ...prev,
      framework_type: value,
      metadata: newMetadata
    }));
  };

  // Update metadata function - updated to match expected signature
  const updateMetadata = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }));
    
    // If autoSave is enabled, trigger save after a short delay
    if (autoSave && onSave) {
      const timer = setTimeout(() => {
        onSave();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  };

  return {
    handleFormChange,
    handleFrameworkChange,
    updateMetadata
  };
}
