
import { ScreenFormData } from "@/types/screen";
import { ValidationError, validateStep } from "@/components/widgets/screens/stepper/StepValidator";
import { useToast } from "@/hooks/use-toast";

export interface UseStepValidationProps {
  formData: ScreenFormData;
}

export function useStepValidation({ formData }: UseStepValidationProps) {
  const { toast } = useToast();
  
  // Validate the current step
  const validateCurrentStep = (currentStep: number): boolean => {
    const errors = validateStep(currentStep, formData);
    
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

  return { validateCurrentStep };
}
