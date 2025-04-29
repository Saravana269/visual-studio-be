
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScreenStepper } from "./ScreenStepper";
import { ScreenFieldEditor } from "./ScreenFieldEditor";
import { ScreenFormData } from "@/types/screen";

interface ScreenDefinePanelProps {
  totalSteps: number;
  currentStep: number;
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave: () => void;
  isEditing: boolean;
  isLoading: boolean;
}

export function ScreenDefinePanel({
  totalSteps,
  currentStep,
  formData,
  setFormData,
  onSave,
  isEditing,
  isLoading
}: ScreenDefinePanelProps) {
  return (
    <Card className="h-full border-gray-800">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-xl">
          {isEditing ? "Edit Screen" : "Define Screen"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {totalSteps > 1 && (
          <ScreenStepper totalSteps={totalSteps} currentStep={currentStep} />
        )}
        
        <div className="space-y-6">
          <ScreenFieldEditor formData={formData} setFormData={setFormData} />
          
          <div className="pt-4 flex justify-end">
            <Button
              onClick={onSave}
              disabled={!formData.name || isLoading}
              className="bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-medium"
            >
              {isLoading ? "Saving..." : isEditing ? "Update Screen" : "Save Screen"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
