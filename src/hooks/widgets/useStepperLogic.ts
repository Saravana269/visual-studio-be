
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

  // Function to go to the next step with validation and saving
  const goToNextStep = async () => {
    // Validate the current step
    const isValid = validateCurrentStep();
    
    if (!isValid) {
      return;
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
    
    // If valid, save the current step and proceed to the next
    setIsStepSaving(true);
    
    try {
      // Special handling for framework type step (3) - create new framework record
      const shouldCreateFramework = stepperStep === 3;
      const success = await onStepSave(stepperStep, dataToSave, shouldCreateFramework);
      
      if (success && stepperStep < steps.length) {
        setStepperStep(stepperStep + 1);
      }
    } catch (error) {
      console.error("Error saving step:", error);
      toast({
        title: "Error",
        description: "Failed to save this step.",
        variant: "destructive"
      });
    } finally {
      setIsStepSaving(false);
    }
  };

  // Function to go to the previous step
  const goToPrevStep = () => {
    if (stepperStep > 1) {
      setStepperStep(stepperStep - 1);
    }
  };

  return {
    currentStep: stepperStep,
    isStepSaving,
    validateCurrentStep,
    goToNextStep,
    goToPrevStep
  };
}
