
import React from "react";
import { ScreenFormData } from "@/types/screen";
import { StepContent } from "./fields/StepContent";

interface ScreenFieldEditorProps {
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave?: () => void;
  autoSave?: boolean;
  currentStepperStep?: number;
}

export function ScreenFieldEditor({ 
  formData, 
  setFormData, 
  onSave, 
  autoSave = false,
  currentStepperStep = 1
}: ScreenFieldEditorProps) {
  return (
    <StepContent
      currentStep={currentStepperStep}
      formData={formData}
      setFormData={setFormData}
      onSave={onSave}
      autoSave={autoSave}
    />
  );
}
