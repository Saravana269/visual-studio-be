
import { useStepNavigation } from "./stepper/useStepNavigation";
import { useStepValidation } from "./stepper/useStepValidation";
import { useStepSaving } from "./stepper/useStepSaving";
import { ScreenFormData } from "@/types/screen";

interface UseStepperLogicProps {
  initialStep?: number;
  steps: { id: number; label: string }[];
  formData: ScreenFormData;
  onStepSave: (step: number, data: Partial<ScreenFormData>, createFramework?: boolean) => Promise<boolean>;
}

export function useStepperLogic({
  initialStep = 1,
  steps,
  formData,
  onStepSave
}: UseStepperLogicProps) {
  // Get step validation functionality
  const { validateCurrentStep: validateStep } = useStepValidation({
    formData
  });

  // Get step saving functionality
  const { isStepSaving, saveCurrentStep: saveStep } = useStepSaving({
    formData,
    onStepSave
  });

  // Function to save the current step before navigation
  const saveBeforeNavigate = async (currentStep: number): Promise<boolean> => {
    // Validate the current step
    const isValid = validateStep(currentStep);
    
    if (!isValid) {
      return false;
    }
    
    // If validation passes, try to save
    return await saveStep(currentStep, false);
  };

  // Get step navigation functionality with save-before-navigate
  const {
    currentStep,
    goToNextStep,
    goToPrevStep,
    goToStep,
    handleStepClick,
    getDisabledSteps,
    canNavigateToStep
  } = useStepNavigation({
    steps,
    formData,
    initialStep,
    onSaveBefore: saveBeforeNavigate
  });

  // Validate the current step
  const validateCurrentStep = (): boolean => {
    return validateStep(currentStep);
  };

  // Save current step with validation
  const saveCurrentStep = async (createFramework: boolean = false): Promise<boolean> => {
    // Validate the current step
    const isValid = validateCurrentStep();
    
    if (!isValid) {
      return false;
    }
    
    return saveStep(currentStep, createFramework);
  };

  return {
    currentStep,
    isStepSaving,
    validateCurrentStep,
    saveCurrentStep,
    goToNextStep,
    goToPrevStep,
    goToStep,
    handleStepClick,
    getDisabledSteps,
    canNavigateToStep
  };
}
