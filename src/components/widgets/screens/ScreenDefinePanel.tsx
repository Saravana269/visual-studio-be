
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
  isEditing,
  isLoading,
  autosave = true
}: ScreenDefinePanelProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [stepperStep, setStepperStep] = useState<number>(1);
  
  // Steps for the stepper
  const steps = [
    { id: 1, label: "Screen Name" },
    { id: 2, label: "Description" },
    { id: 3, label: "Response Type" },
    { id: 4, label: "Preview" }
  ];

  // Handle autosave
  useEffect(() => {
    if (!autosave) return;

    // Clear any existing timeout
    if (saveTimeout) clearTimeout(saveTimeout);

    // Set a new timeout
    const timeout = setTimeout(() => {
      onSave(formData);
      setLastSaved(new Date());
    }, 1500); // 1.5 seconds after changes

    setSaveTimeout(timeout);

    // Cleanup
    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [formData, autosave, onSave]);

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
            disabled={stepperStep === 1} 
            className="bg-gray-800 hover:bg-gray-700 text-white">
            Previous
          </Button>
          
          <div>
            {(!autosave && stepperStep === steps.length) && (
              <Button 
                onClick={() => onSave(formData)} 
                disabled={!formData.name || isLoading} 
                className="bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-medium">
                {isLoading ? "Saving..." : isEditing ? "Update Screen" : "Save Screen"}
              </Button>
            )}
            
            {stepperStep < steps.length && (
              <Button 
                onClick={goToNextStep} 
                className="bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-medium">
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>;
}
