
import React from "react";
import { ScreenStepper } from "./ScreenStepper";
import { ScreenFieldEditor } from "./ScreenFieldEditor";
import { ScreenFormData } from "@/types/screen";
import { StepperHeader } from "./stepper/StepperHeader";
import { StepperNavigation } from "./stepper/StepperNavigation";
import { useStepperLogic } from "@/hooks/widgets/useStepperLogic";

interface ScreenDefinePanelContentProps {
  steps: { id: number; label: string }[];
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave: (data: ScreenFormData) => void;
  onStepSave: (step: number, data: Partial<ScreenFormData>, createFramework?: boolean) => Promise<boolean>;
  lastSaved: Date | null;
  isEditing: boolean;
  isLoading: boolean;
  autosave?: boolean;
}

export function ScreenDefinePanelContent({
  steps,
  formData,
  setFormData,
  onSave,
  onStepSave,
  lastSaved,
  isEditing,
  isLoading,
  autosave = false
}: ScreenDefinePanelContentProps) {
  const { 
    currentStep, 
    isStepSaving, 
    goToNextStep, 
    goToPrevStep,
    validateCurrentStep
  } = useStepperLogic({
    steps,
    formData,
    onStepSave
  });

  // Function to handle final save with validation
  const handleFinalSave = () => {
    // Validate the current step
    const isValid = validateCurrentStep();
    
    if (!isValid) {
      return;
    }
    
    // If all validations pass, save the form
    onSave(formData);
  };

  return (
    <div className="flex flex-col h-full border border-gray-800 rounded-lg overflow-hidden">
      <StepperHeader lastSaved={lastSaved} />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-6 pt-4">
          <ScreenStepper 
            totalSteps={steps.length} 
            currentStep={currentStep - 1}
            steps={steps.map(step => step.label)}
          />
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <ScreenFieldEditor 
            formData={formData} 
            setFormData={setFormData} 
            onSave={() => onSave(formData)} 
            autoSave={autosave} 
            currentStepperStep={currentStep}
          />
        </div>
        
        <StepperNavigation 
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={goToPrevStep}
          onNext={goToNextStep}
          onSave={handleFinalSave}
          isPreviousDisabled={currentStep === 1 || isStepSaving}
          isNextDisabled={!formData.name || isLoading || isStepSaving}
          isLoading={isLoading || isStepSaving}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
