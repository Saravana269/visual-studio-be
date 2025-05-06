
import React from "react";
import { FrameworkTypeStep } from "./FrameworkTypeStep";
import { ScreenNameStep } from "./ScreenNameStep";
import { DescriptionStep } from "./DescriptionStep";
import { OutputStep } from "./OutputStep";
import { ScreenFormData } from "@/types/screen";

interface StepResolverProps {
  currentStep: number;
  formData: ScreenFormData;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFrameworkChange: (value: string | null) => void;
  updateMetadata: (metadata: Record<string, any>) => void;
  handleConnect: (value: any, context?: string) => void;
  widgetId?: string;
}

export function StepResolver({
  currentStep,
  formData,
  handleFormChange,
  handleFrameworkChange,
  updateMetadata,
  handleConnect,
  widgetId
}: StepResolverProps) {
  // Render the appropriate step based on current step number
  switch (currentStep) {
    case 1:
      return (
        <ScreenNameStep 
          name={formData.name}
          onChange={(name: string) => {
            const syntheticEvent = {
              target: { name: 'name', value: name }
            } as React.ChangeEvent<HTMLInputElement>;
            handleFormChange(syntheticEvent);
          }}
        />
      );
    case 2:
      return (
        <DescriptionStep 
          description={formData.description}
          onChange={(description: string) => {
            const syntheticEvent = {
              target: { name: 'description', value: description }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            handleFormChange(syntheticEvent);
          }}
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
      return (
        <div className="p-6 text-center">
          <p className="text-gray-500">Step not found</p>
        </div>
      );
  }
}
