
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
          formData={formData} 
          handleFormChange={handleFormChange} 
        />
      );
    case 2:
      return (
        <DescriptionStep 
          formData={formData} 
          handleFormChange={handleFormChange} 
        />
      );
    case 3:
      return (
        <FrameworkTypeStep 
          formData={formData} 
          handleFrameworkChange={handleFrameworkChange} 
        />
      );
    case 4:
      return (
        <OutputStep 
          formData={formData} 
          updateMetadata={updateMetadata}
          handleConnect={handleConnect}
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
