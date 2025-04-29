
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card className="h-full border-gray-800">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-xl">
          {isEditing ? "Edit Screen" : "Define Screen"}
        </CardTitle>
        {lastSaved && (
          <p className="text-xs text-gray-400">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {totalSteps > 1 && (
          <ScreenStepper totalSteps={totalSteps} currentStep={currentStep} />
        )}
        
        <div className="space-y-6">
          <ScreenFieldEditor 
            formData={formData} 
            setFormData={setFormData} 
            onSave={() => onSave(formData)}
            autoSave={autosave} 
          />
          
          {!autosave && (
            <div className="pt-4 flex justify-end">
              <Button
                onClick={() => onSave(formData)}
                disabled={!formData.name || isLoading}
                className="bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-medium"
              >
                {isLoading ? "Saving..." : isEditing ? "Update Screen" : "Save Screen"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
