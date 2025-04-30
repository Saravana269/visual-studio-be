
import React from "react";
import { ScreenNameStep } from "./steps/ScreenNameStep";
import { DescriptionStep } from "./steps/DescriptionStep";
import { FrameworkTypeStep } from "./steps/FrameworkTypeStep";
import { OutputStep } from "./steps/OutputStep";
import { ScreenFormData } from "@/types/screen";
import { useStepContentHandlers } from "@/hooks/widgets/useStepContentHandlers";

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
  // Extract handlers to a separate hook
  const { handleFormChange, handleFrameworkChange, updateMetadata } = useStepContentHandlers({
    formData,
    setFormData,
    onSave,
    autoSave
  });

  // Render appropriate step based on currentStep
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
    case 4:
      return (
        <OutputStep 
          frameworkType={formData.framework_type}
          metadata={formData.metadata || {}}
        />
      );
    default:
      return null;
  }
}
