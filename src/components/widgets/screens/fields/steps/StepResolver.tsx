
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
  // Create wrapper handlers for ScreenNameStep and DescriptionStep
  const handleNameChange = (name: string) => {
    // Create a synthetic event-like object to work with handleFormChange
    const syntheticEvent = {
      target: {
        name: "name",
        value: name
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleFormChange(syntheticEvent);
  };

  const handleDescriptionChange = (description: string) => {
    // Create a synthetic event-like object to work with handleFormChange
    const syntheticEvent = {
      target: {
        name: "description",
        value: description
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    handleFormChange(syntheticEvent);
  };

  switch (currentStep) {
    case 1:
      return (
        <ScreenNameStep
          name={formData.name}
          onChange={handleNameChange}
        />
      );
      
    case 2:
      return (
        <DescriptionStep
          description={formData.description}
          onChange={handleDescriptionChange}
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
          screenId={screenId}
        />
      );
      
    default:
      return <div>Unknown step</div>;
  }
}
