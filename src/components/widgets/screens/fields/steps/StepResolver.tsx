
import React from "react";
import { ScreenNameStep } from "./ScreenNameStep";
import { DescriptionStep } from "./DescriptionStep";
import { FrameworkTypeStep } from "./FrameworkTypeStep";
import { OutputStep } from "./OutputStep";
import { ScreenFormData } from "@/types/screen";

interface StepResolverProps {
  currentStep: number;
  formData: ScreenFormData;
  handleFormChange: (field: string, value: any) => void;
  handleFrameworkChange: (value: string) => void;
  updateMetadata: (updates: Record<string, any>) => void;
  handleConnect: (frameworkType: string, value: any, context?: string) => void;
  widgetId?: string;
}

export const StepResolver: React.FC<StepResolverProps> = ({
  currentStep,
  formData,
  handleFormChange,
  handleFrameworkChange,
  updateMetadata,
  handleConnect,
  widgetId
}) => {
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
          onConnect={handleConnect}
          widgetId={widgetId}
        />
      );
    default:
      return null;
  }
};
