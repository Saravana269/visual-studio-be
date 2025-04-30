
import { Button } from "@/components/ui/button";
import { ScreenStepper } from "./ScreenStepper";
import { ScreenFieldEditor } from "./ScreenFieldEditor";
import { ScreenFormData } from "@/types/screen";
import { useEffect, useState } from "react";

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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [stepperStep, setStepperStep] = useState<number>(1);
  const [lastNotification, setLastNotification] = useState<Date | null>(null);
  const [isStepSaving, setIsStepSaving] = useState<boolean>(false);
  
  // Steps for the stepper - reduced to 3 steps
  const steps = [
    { id: 1, label: "Screen Name" },
    { id: 2, label: "Description" },
    { id: 3, label: "Framework Type" }
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

  // Function to go to the next step with validation and saving
  const goToNextStep = async () => {
    // Validation for the current step
    let isValid = true;
    let dataToSave: Partial<ScreenFormData> = {};
    
    // Validate and prepare data based on current step
    switch (stepperStep) {
      case 1: // Screen Name
        if (!formData.name?.trim()) {
          isValid = false;
          // You could add toast notification here
        } else {
          dataToSave = { name: formData.name };
        }
        break;
        
      case 2: // Description
        dataToSave = { description: formData.description };
        break;
        
      case 3: // Framework Type
        if (!formData.framework_type) {
          isValid = false;
        } else {
          dataToSave = { 
            framework_type: formData.framework_type,
            metadata: formData.metadata 
          };
        }
        break;
    }
    
    // If valid, save the current step and proceed to the next
    if (isValid) {
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
      } finally {
        setIsStepSaving(false);
      }
    }
  };

  // Function to go to the previous step
  const goToPrevStep = () => {
    if (stepperStep > 1) {
      setStepperStep(stepperStep - 1);
    }
  };

  return <div className="flex flex-col h-full border border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-[#00FF00]/20 p-4 border-b border-[#00FF00]/30">
        <h2 className="text-xl font-medium text-[#00FF00]">Screen Define Area</h2>
        {lastSaved && (
          <div className="text-sm text-gray-400 mt-1">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>
      
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
        
        <div className="border-t border-gray-800 p-4 flex justify-between">
          <Button 
            onClick={goToPrevStep} 
            disabled={stepperStep === 1 || isStepSaving} 
            className="bg-gray-800 hover:bg-gray-700 text-white">
            Previous
          </Button>
          
          <div>
            {(stepperStep === steps.length) && (
              <Button 
                onClick={() => onSave(formData)} 
                disabled={!formData.name || isLoading || isStepSaving} 
                className="bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-medium">
                {isLoading || isStepSaving ? "Saving..." : isEditing ? "Update Screen" : "Save Screen"}
              </Button>
            )}
            
            {stepperStep < steps.length && (
              <Button 
                onClick={goToNextStep}
                disabled={isStepSaving}
                className="bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-medium">
                {isStepSaving ? "Saving..." : "Next"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>;
}
