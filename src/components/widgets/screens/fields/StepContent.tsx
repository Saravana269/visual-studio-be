
import React from "react";
import { ScreenNameStep } from "./steps/ScreenNameStep";
import { DescriptionStep } from "./steps/DescriptionStep";
import { FrameworkTypeStep } from "./steps/FrameworkTypeStep";
import { ScreenFormData } from "@/types/screen";
import { useToast } from "@/hooks/use-toast";

interface StepContentProps {
  currentStep: number;
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave?: () => void;
  autoSave?: boolean;
}

export function StepContent({
  currentStep, 
  formData, 
  setFormData,
  onSave,
  autoSave = false
}: StepContentProps) {
  const { toast } = useToast();
  
  // Handle form field changes
  const handleFormChange = (field: string, value: any) => {
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
  const handleFrameworkChange = (value: string) => {
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

  // Update metadata function - standardized format
  const updateMetadata = (updates: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        ...updates
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

  switch (currentStep) {
    case 1:
      return (
        <ScreenNameStep 
          name={formData.name} 
          onChange={(value) => handleFormChange("name", value)} 
        />
      );
    case 2:
      return (
        <DescriptionStep 
          description={formData.description} 
          onChange={(value) => handleFormChange("description", value)} 
        />
      );
    case 3:
      return (
        <FrameworkTypeStep 
          frameworkType={formData.framework_type}
          metadata={formData.metadata || {}}
          onFrameworkChange={handleFrameworkChange}
          onMetadataUpdate={updateMetadata}
        />
      );
    default:
      return null;
  }
}
