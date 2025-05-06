
import React, { useState, useEffect } from "react";
import { StepContent } from "./fields/StepContent";
import { ScreenFormData } from "@/types/screen";
import { StepResolver } from "./fields/steps/StepResolver";
import { useStepContentHandlers } from "@/hooks/widgets/useStepContentHandlers";
import { useConnectionHandler } from "@/hooks/widgets/useConnectionHandler";
import { useParams } from "react-router-dom";

interface ScreenFieldEditorProps {
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave?: (data: ScreenFormData) => void;
  autoSave?: boolean;
  currentStepperStep?: number;
  screenId?: string;
}

export function ScreenFieldEditor({
  formData,
  setFormData,
  onSave,
  autoSave = false,
  currentStepperStep = 1,
  screenId
}: ScreenFieldEditorProps) {
  const { id: widgetId } = useParams<{ id: string }>();
  
  const { handleFormChange, handleFrameworkChange, updateMetadata } = useStepContentHandlers({
    formData,
    setFormData,
    onSave: onSave ? () => onSave(formData) : undefined,
    autoSave
  });
  
  const { handleConnect } = useConnectionHandler(widgetId);

  // Listen for changes to formData and trigger save if autoSave is enabled
  useEffect(() => {
    if (autoSave && onSave) {
      const timer = setTimeout(() => {
        onSave(formData);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [formData, autoSave, onSave]);

  return (
    <div className="h-full">
      <StepResolver
        currentStep={currentStepperStep}
        formData={formData}
        handleFormChange={handleFormChange}
        handleFrameworkChange={handleFrameworkChange}
        updateMetadata={updateMetadata}
        handleConnect={handleConnect}
        widgetId={widgetId}
        screenId={screenId}
      />
    </div>
  );
}
