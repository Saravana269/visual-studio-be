
import { ScreenStepper } from "./ScreenStepper";
import { ScreenFieldEditor } from "./ScreenFieldEditor";
import { ScreenFormData } from "@/types/screen";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { StepperHeader } from "./stepper/StepperHeader";
import { StepperNavigation } from "./stepper/StepperNavigation";
import { validateStep } from "./stepper/StepValidator";

interface ScreenDefinePanelProps {
  totalSteps: number;
  currentStep: number;
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave: (data: ScreenFormData) => void;
  onStepSave: (step: number, data: Partial<ScreenFormData>, createFramework?: boolean) => Promise<boolean>;
  isEditing: boolean;
  isLoading: boolean;
  autosave?: boolean;
}

export function ScreenDefinePanel({
  totalSteps,
  currentStep,
  formData,
  setFormData,
  onSave,
  onStepSave,
  isEditing,
  isLoading,
  autosave = false
}: ScreenDefinePanelProps) {
  const { toast } = useToast();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [stepperStep, setStepperStep] = useState<number>(1);
  const [lastNotification, setLastNotification] = useState<Date | null>(null);
  const [isStepSaving, setIsStepSaving] = useState<boolean>(false);
  
  // Steps for the stepper - updated to 4 steps
  const steps = [
    { id: 1, label: "Screen Name" },
    { id: 2, label: "Description" },
    { id: 3, label: "Framework Type" },
    { id: 4, label: "Output" }
  ];

  // Handle autosave with improved notification handling
  useEffect(() => {
    if (!autosave) return;

    // Clear any existing timeout
    if (saveTimeout) clearTimeout(saveTimeout);

    // Set a new timeout with increased delay (5 seconds)
    const timeout = setTimeout(() => {
      onSave(formData);
      
      // Update last saved timestamp
      const now = new Date();
      setLastSaved(now);
      
      // Only show notification if it's been more than 10 seconds since the last one
      if (!lastNotification || (now.getTime() - lastNotification.getTime() > 10000)) {
        setLastNotification(now);
      }
    }, 5000);

    setSaveTimeout(timeout);

    // Cleanup
    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [formData, autosave, onSave, lastNotification]);

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
        setLastSaved(new Date());
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
    <div className="flex flex-col h-full border border-gray-800 rounded-lg overflow-hidden">
      <StepperHeader lastSaved={lastSaved} />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-6 pt-4">
          <ScreenStepper 
            totalSteps={steps.length} 
            currentStep={stepperStep - 1}
            steps={steps.map(step => step.label)}
          />
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <ScreenFieldEditor 
            formData={formData} 
            setFormData={setFormData} 
            onSave={() => onSave(formData)} 
            autoSave={autosave} 
            currentStepperStep={stepperStep}
          />
        </div>
        
        <StepperNavigation 
          currentStep={stepperStep}
          totalSteps={steps.length}
          onPrevious={goToPrevStep}
          onNext={goToNextStep}
          onSave={handleFinalSave}
          isPreviousDisabled={stepperStep === 1 || isStepSaving}
          isNextDisabled={!formData.name || isLoading || isStepSaving}
          isLoading={isLoading || isStepSaving}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
