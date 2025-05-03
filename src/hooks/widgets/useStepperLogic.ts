
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
  // Get step navigation functionality
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
    initialStep
  });

  // Get step validation functionality
  const { validateCurrentStep: validateStep } = useStepValidation({
    formData
  });

  // Get step saving functionality
  const { isStepSaving, saveCurrentStep: saveStep } = useStepSaving({
    formData,
    onStepSave
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
