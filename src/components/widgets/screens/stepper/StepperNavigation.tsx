
import { Button } from "@/components/ui/button";

interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  isLoading: boolean;
  isEditing: boolean;
}

export function StepperNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSave,
  isPreviousDisabled,
  isNextDisabled,
  isLoading,
  isEditing
}: StepperNavigationProps) {
  return (
    <div className="border-t border-gray-800 p-4 flex justify-between">
      <Button 
        onClick={onPrevious} 
        disabled={isPreviousDisabled} 
        className="bg-gray-800 hover:bg-gray-700 text-white">
        Previous
      </Button>
      
      <div>
        {(currentStep === totalSteps) && (
          <Button 
            onClick={onSave} 
            disabled={isNextDisabled} 
            className="bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-medium">
            {isLoading ? "Saving..." : isEditing ? "Update Framework" : "Save Framework"}
          </Button>
        )}
        
        {currentStep < totalSteps && (
          <Button 
            onClick={onNext}
            disabled={isLoading}
            className="bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-medium">
            {isLoading ? "Saving..." : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
