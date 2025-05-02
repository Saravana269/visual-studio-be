
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScreenFormData } from "@/types/screen";
import { validateStep } from "@/components/widgets/screens/stepper/StepValidator";

interface UseStepperLogicProps {
  initialStep?: number;
  steps: { id: number; label: string }[];
  formData: ScreenFormData;
  onStepSave: (step: number, data: Partial<ScreenFormData>, createFramework?: boolean) => Promise<boolean>;
}

// Local storage key for selected COE
const SELECTED_COE_KEY = "selected_coe_for_screen";

export function useStepperLogic({
  initialStep = 1,
  steps,
  formData,
  onStepSave
}: UseStepperLogicProps) {
  const { toast } = useToast();
  const [stepperStep, setStepperStep] = useState<number>(initialStep);
  const [isStepSaving, setIsStepSaving] = useState<boolean>(false);

  // Validate the current step
  const validateCurrentStep = (): boolean => {
    const errors = validateStep(stepperStep, formData);
    
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.map(error => error.message).join(", "),
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  // Save current step data with option to navigate to specific step after saving
  const saveCurrentStep = async (createFramework: boolean = false, navigateToStepAfter?: number): Promise<boolean> => {
    // Validate the current step
    const isValid = validateCurrentStep();
    
    if (!isValid) {
      return false;
    }
    
    // Prepare data to save based on current step
    let dataToSave: Partial<ScreenFormData> = {};
    
    switch (stepperStep) {
      case 1: // Screen Name
        dataToSave = { name: formData.name };
        break;
        
      case 2: // Description
        dataToSave = { description: formData.description };
        break;
        
      case 3: // Framework Type
        dataToSave = { 
          framework_type: formData.framework_type,
          metadata: formData.metadata 
        };
        break;

      case 4: // Output
        // Just save everything in the final step
        dataToSave = { 
          name: formData.name,
          description: formData.description,
          framework_type: formData.framework_type,
          metadata: formData.metadata
        };
        break;
    }
    
    // Save the current step without advancing
    setIsStepSaving(true);
    
    try {
      const success = await onStepSave(stepperStep, dataToSave, createFramework);
      
      // If save was successful and this is the COE Manager framework type
      if (success && formData.framework_type === "COE Manager" && createFramework) {
        // Clear the localStorage entry for selected COE
        localStorage.removeItem(SELECTED_COE_KEY);
      }
      
      // If save was successful and a target step is specified, navigate to that step
      if (success && navigateToStepAfter !== undefined) {
        setStepperStep(navigateToStepAfter);
      }
      
      return success;
    } catch (error) {
      console.error("Error saving step:", error);
      toast({
        title: "Error",
        description: "Failed to save this step.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsStepSaving(false);
    }
  };

  // Function to go to the next step with validation and saving
  const goToNextStep = async () => {
    // Save the current step
    const success = await saveCurrentStep(stepperStep === 3); // Create framework when on step 3
    
    // If save was successful and we're not at the last step, advance to next step
    if (success && stepperStep < steps.length) {
      setStepperStep(stepperStep + 1);
    }
  };

  // Function to go to the previous step
  const goToPrevStep = () => {
    if (stepperStep > 1) {
      setStepperStep(stepperStep - 1);
    }
  };

  // New function to navigate directly to a step
  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setStepperStep(step);
    }
  };

  return {
    currentStep: stepperStep,
    isStepSaving,
    validateCurrentStep,
    saveCurrentStep,
    goToNextStep,
    goToPrevStep,
    goToStep
  };
}
