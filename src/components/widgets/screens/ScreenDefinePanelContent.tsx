
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
  const { toast } = useToast();
  const { 
    currentStep, 
    isStepSaving, 
    goToNextStep, 
    goToPrevStep,
    validateCurrentStep,
    saveCurrentStep,
    goToStep
  } = useStepperLogic({
    steps,
    formData,
    onStepSave
  });

  // Function to handle updating the framework without advancing to the next step
  const handleUpdateFramework = async () => {
    // Save current step with createFramework=true and navigate to step 4 after success
    const success = await saveCurrentStep(true, 4);
    
    if (success) {
      toast({
        title: "Success",
        description: "Framework updated successfully",
      });
    }
  };

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
        />
      </div>
      
      {/* Fixed navigation footer */}
      <div className="flex-shrink-0">
        <StepperNavigation 
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={goToPrevStep}
          onNext={goToNextStep}
          onSave={handleFinalSave}
          onUpdateFramework={currentStep === 3 ? handleUpdateFramework : undefined}
          isPreviousDisabled={currentStep === 1 || isStepSaving || isLoading}
          isNextDisabled={!formData.name || isLoading || isStepSaving}
          isLoading={isLoading || isStepSaving}
          isEditing={isEditing}
          showOnlyUpdateFramework={currentStep === 3} // Show only Update Framework button on step 3
        />
      </div>
    </div>
  );
}
