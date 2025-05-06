
import React from "react";
import { ScreenStepper } from "./ScreenStepper";
import { ScreenFieldEditor } from "./ScreenFieldEditor";
import { ScreenFormData } from "@/types/screen";
import { StepperHeader } from "./stepper/StepperHeader";
import { StepperNavigation } from "./stepper/StepperNavigation";
import { useStepperLogic } from "@/hooks/widgets/useStepperLogic";
import { useToast } from "@/hooks/use-toast";

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
  screenId?: string;
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
  autosave = false,
  screenId
}: ScreenDefinePanelContentProps) {
  const { toast } = useToast();
  const { 
    currentStep, 
    isStepSaving, 
    goToNextStep, 
    goToPrevStep,
    validateCurrentStep,
    saveCurrentStep,
    goToStep,
    handleStepClick,
    getDisabledSteps
  } = useStepperLogic({
    steps,
    formData,
    onStepSave
  });
  
  // Get the list of disabled steps
  const disabledSteps = getDisabledSteps();

  // Function to handle updating the framework without advancing to the next step
  const handleUpdateFramework = async () => {
    // Save current step with createFramework=true
    const success = await saveCurrentStep(true);
    
    if (success) {
      // Successfully updated framework, now manually navigate to step 4
      goToStep(4);
      toast({
        title: "Success",
        description: "Framework updated successfully",
      });
    }
  };

  // Function to handle final save with validation
  const handleFinalSave = async () => {
    // Validate the current step
    const isValid = validateCurrentStep();
    
    if (!isValid) {
      return;
    }
    
    // Try to save the current step first
    const saveSuccess = await saveCurrentStep();
    
    if (!saveSuccess) {
      toast({
        title: "Error",
        description: "Failed to save current step. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // If all validations pass and step saved, save the entire form
    onSave(formData);
  };

  // Handle next step click with saving
  const handleNextClick = async () => {
    // goToNextStep already includes saving logic
    goToNextStep();
  };

  // Determine if we should show only the Update Framework button (now for both steps 3 AND 4)
  const showOnlyUpdateFramework = currentStep === 3 || currentStep === 4;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed header */}
      <div className="bg-[#00FF00] p-4 border-b border-[#00FF00]/30 flex-shrink-0">
        <h2 className="text-black text-lg font-medium">Screen Define Area</h2>
      </div>
      
      {/* Fixed stepper area */}
      <div className="px-6 pt-4 flex-shrink-0">
        <ScreenStepper 
          totalSteps={steps.length} 
          currentStep={currentStep - 1}
          steps={steps.map(step => step.label)}
          onStepClick={handleStepClick}
          disabledSteps={disabledSteps}
        />
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto px-6 pb-4">
        <ScreenFieldEditor 
          formData={formData} 
          setFormData={setFormData} 
          onSave={() => onSave(formData)} 
          autoSave={autosave} 
          currentStepperStep={currentStep}
          screenId={screenId}
        />
      </div>
      
      {/* Fixed navigation footer */}
      <div className="flex-shrink-0">
        <StepperNavigation 
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={goToPrevStep}
          onNext={handleNextClick}
          onSave={handleFinalSave}
          onUpdateFramework={currentStep === 3 ? handleUpdateFramework : undefined}
          isPreviousDisabled={currentStep === 1 || isStepSaving || isLoading}
          isNextDisabled={!formData.name || isLoading || isStepSaving}
          isLoading={isLoading || isStepSaving}
          isEditing={isEditing}
          showOnlyUpdateFramework={showOnlyUpdateFramework}
        />
      </div>
    </div>
  );
}
