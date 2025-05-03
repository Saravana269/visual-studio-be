
import { useState } from "react";
import { ScreenFormData } from "@/types/screen";
import { useToast } from "@/hooks/use-toast";

// Local storage key for selected COE
const SELECTED_COE_KEY = "selected_coe_for_screen";

export interface UseStepSavingProps {
  formData: ScreenFormData;
  onStepSave: (step: number, data: Partial<ScreenFormData>, createFramework?: boolean) => Promise<boolean>;
}

export function useStepSaving({ formData, onStepSave }: UseStepSavingProps) {
  const { toast } = useToast();
  const [isStepSaving, setIsStepSaving] = useState<boolean>(false);

  // Prepare data to save based on current step
  const prepareStepData = (stepperStep: number): Partial<ScreenFormData> => {
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
    
    return dataToSave;
  };

  // Save current step data
  const saveCurrentStep = async (
    currentStep: number,
    createFramework: boolean = false
  ): Promise<boolean> => {
    // Prepare data to save based on current step
    const dataToSave = prepareStepData(currentStep);
    
    // Save the current step without advancing
    setIsStepSaving(true);
    
    try {
      const success = await onStepSave(currentStep, dataToSave, createFramework);
      
      // If save was successful and this is the COE Manager framework type
      if (success && formData.framework_type === "COE Manager" && createFramework) {
        // Clear the localStorage entry for selected COE
        localStorage.removeItem(SELECTED_COE_KEY);
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

  return {
    isStepSaving,
    saveCurrentStep
  };
}
