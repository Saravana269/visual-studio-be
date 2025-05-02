
import { useState } from "react";
import { ScreenFormData } from "@/types/screen";
import { useToast } from "@/hooks/use-toast";

export interface UseStepNavigationProps {
  steps: { id: number; label: string }[];
  formData: ScreenFormData;
  initialStep?: number;
}

export function useStepNavigation({ 
  steps, 
  formData,
  initialStep = 1 
}: UseStepNavigationProps) {
  const { toast } = useToast();
  const [stepperStep, setStepperStep] = useState<number>(initialStep);

  // Check if a step is accessible based on form data validity
  const canNavigateToStep = (targetStep: number): boolean => {
    // Allow navigation to step 1 at any time
    if (targetStep === 1) return true;
    
    // For steps 2-4, check if previous requirements are met
    if (targetStep === 2) {
      // To go to step 2, screenName must not be empty
      return !!formData.name?.trim();
    }
    
    if (targetStep === 3) {
      // To go to step 3, both name and description must not be empty
      return !!formData.name?.trim() && !!formData.description?.trim();
    }
    
    if (targetStep === 4) {
      // To go to step 4, name, description, and framework_type must be filled
      return (
        !!formData.name?.trim() && 
        !!formData.description?.trim() && 
        !!formData.framework_type
      );
    }
    
    return false;
  };
  
  // Get array of step numbers that should be disabled for clicking
  const getDisabledSteps = (): number[] => {
    const disabledSteps: number[] = [];
    
    // Step 1 is always enabled
    
    // Check if step 2 should be disabled
    if (!formData.name?.trim()) {
      disabledSteps.push(2);
    }
    
    // Check if step 3 should be disabled
    if (!formData.name?.trim() || !formData.description?.trim()) {
      disabledSteps.push(3);
    }
    
    // Check if step 4 should be disabled
    if (!formData.name?.trim() || !formData.description?.trim() || !formData.framework_type) {
      disabledSteps.push(4);
    }
    
    return disabledSteps;
  };
  
  // Handle clicking on a step number
  const handleStepClick = (targetStep: number): boolean => {
    // Always allow backward navigation
    if (targetStep <= stepperStep) {
      setStepperStep(targetStep);
      return true;
    }
    
    // For forward navigation, check requirements
    if (canNavigateToStep(targetStep)) {
      setStepperStep(targetStep);
      return true;
    } else {
      // Show feedback via toast
      toast({
        title: "Cannot Navigate",
        description: "Please complete the required fields in previous steps first.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Function to go to the next step
  const goToNextStep = () => {
    if (stepperStep < steps.length) {
      setStepperStep(stepperStep + 1);
    }
  };

  // Function to go to the previous step
  const goToPrevStep = () => {
    if (stepperStep > 1) {
      setStepperStep(stepperStep - 1);
    }
  };

  // Function to navigate directly to a step
  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setStepperStep(step);
    }
  };

  return {
    currentStep: stepperStep,
    goToNextStep,
    goToPrevStep,
    goToStep,
    handleStepClick,
    getDisabledSteps,
    canNavigateToStep
  };
}
