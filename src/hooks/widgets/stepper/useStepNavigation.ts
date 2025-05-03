import { useState } from "react";
import { ScreenFormData } from "@/types/screen";
import { useToast } from "@/hooks/use-toast";

export interface UseStepNavigationProps {
  steps: { id: number; label: string }[];
  formData: ScreenFormData;
  initialStep?: number;
  onSaveBefore?: (step: number) => Promise<boolean>; // New prop for saving before navigation
}

export function useStepNavigation({ 
  steps, 
  formData,
  initialStep = 1,
  onSaveBefore
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
  
  // Handle clicking on a step number - now with saving logic
  const handleStepClick = async (targetStep: number): Promise<boolean> => {
    // Always allow backward navigation
    if (targetStep <= stepperStep) {
      // For backward navigation, we should still save the current step
      // but we don't block navigation if saving fails
      if (onSaveBefore) {
        await onSaveBefore(stepperStep);
      }
      setStepperStep(targetStep);
      return true;
    }
    
    // For forward navigation, check requirements
    if (canNavigateToStep(targetStep)) {
      // Try to save current step before navigating
      if (onSaveBefore) {
        const saveSucceeded = await onSaveBefore(stepperStep);
        if (!saveSucceeded) {
          toast({
            title: "Save Failed",
            description: "Unable to save your changes. Please try again.",
            variant: "destructive"
          });
          return false;
        }
      }
      
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

  // Function to go to the next step - now with saving logic
  const goToNextStep = async () => {
    if (stepperStep < steps.length) {
      // Try to save current step before going to next
      if (onSaveBefore) {
        const saveSucceeded = await onSaveBefore(stepperStep);
        if (!saveSucceeded) {
          toast({
            title: "Save Failed",
            description: "Unable to save your changes. Please try again.",
            variant: "destructive"
          });
          return;
        }
      }
      
      setStepperStep(stepperStep + 1);
    }
  };

  // Function to go to the previous step
  const goToPrevStep = async () => {
    if (stepperStep > 1) {
      // Optional: save current step before going back
      if (onSaveBefore) {
        await onSaveBefore(stepperStep);
      }
      
      setStepperStep(stepperStep - 1);
    }
  };

  // Function to navigate directly to a step
  const goToStep = async (step: number) => {
    if (step >= 1 && step <= steps.length) {
      // Try to save current step before changing steps
      if (onSaveBefore) {
        const saveSucceeded = await onSaveBefore(stepperStep);
        if (!saveSucceeded && step > stepperStep) {
          toast({
            title: "Save Failed",
            description: "Unable to save your changes. Please try again.",
            variant: "destructive"
          });
          return;
        }
      }
      
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
