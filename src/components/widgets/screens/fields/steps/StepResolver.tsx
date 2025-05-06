
import React from "react";
import { ScreenNameStep } from "./ScreenNameStep";
import { DescriptionStep } from "./DescriptionStep";
import { FrameworkTypeStep } from "./FrameworkTypeStep";
import { OutputStep } from "./OutputStep";
import { ScreenFormData } from "@/types/screen";

interface StepResolverProps {
  currentStep: number;
  formData: ScreenFormData;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFrameworkChange: (value: string | null) => void;
  updateMetadata: (updates: Record<string, any>) => void;
  handleConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export function StepResolver({
  currentStep,
  formData,
  handleFormChange,
  handleFrameworkChange,
  updateMetadata,
  handleConnect,
  widgetId,
  screenId
}: StepResolverProps) {
  switch (currentStep) {
    case 1:
      return (
        <ScreenNameStep
          name={formData.name}
          onChange={handleFormChange}
        />
      );
      
    case 2:
      return (
        <DescriptionStep
          description={formData.description}
          onChange={handleFormChange}
        />
      );
      
    case 3:
      return (
        <FrameworkTypeStep
          selectedFrameworkType={formData.framework_type}
          onFrameworkChange={handleFrameworkChange}
        />
      );
      
    case 4:
      return (
        <OutputStep
          frameworkType={formData.framework_type}
          metadata={formData.metadata || {}}
          onConnect={handleConnect}
          updateMetadata={updateMetadata}
          widgetId={widgetId}
          screenId={screenId}
        />
      );
      
    default:
      return <div>Unknown step</div>;
  }
}
