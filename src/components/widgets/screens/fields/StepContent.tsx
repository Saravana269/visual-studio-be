
import React from "react";
import { ScreenFormData } from "@/types/screen";
import { useStepContentHandlers } from "@/hooks/widgets/useStepContentHandlers";
import { useConnectionHandler } from "@/hooks/widgets/useConnectionHandler";
import { StepResolver } from "./steps/StepResolver";

interface StepContentProps {
  currentStep: number;
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave?: () => void;
  autoSave?: boolean;
  screenId?: string;
  widgetId?: string;
}

export function StepContent({
  currentStep, 
  formData, 
  setFormData,
  onSave,
  autoSave = false,
  screenId,
  widgetId
}: StepContentProps) {
  // Extract handlers to a separate hook
  const { handleFormChange, handleFrameworkChange, updateMetadata } = useStepContentHandlers({
    formData,
    setFormData,
    onSave,
    autoSave
  });

  // Extract connection handler to a separate hook
  const { handleConnect } = useConnectionHandler(widgetId);

  return (
    <StepResolver
      currentStep={currentStep}
      formData={formData}
      handleFormChange={handleFormChange}
      handleFrameworkChange={handleFrameworkChange}
      updateMetadata={updateMetadata}
      handleConnect={handleConnect}
      screenId={screenId}
      widgetId={widgetId}
    />
  );
}
