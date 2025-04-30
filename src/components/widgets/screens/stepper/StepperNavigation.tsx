
import { Button } from "@/components/ui/button";

interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onUpdateFramework?: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  isLoading: boolean;
  isEditing: boolean;
  showOnlyUpdateFramework?: boolean;
}

export function StepperNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSave,
  onUpdateFramework,
  isPreviousDisabled,
  isNextDisabled,
  isLoading,
  isEditing,
  showOnlyUpdateFramework = false
}: StepperNavigationProps) {
  return (
    <div className="border-t border-gray-800 p-4 flex justify-between">
      {!showOnlyUpdateFramework && (
        <Button 
          onClick={onPrevious} 
          disabled={isPreviousDisabled} 
          className="bg-gray-800 hover:bg-gray-700 text-white text-sm"
        >
          Previous
        </Button>
      )}
      
      <div className={`flex gap-2 ${showOnlyUpdateFramework ? 'w-full justify-center' : ''}`}>
        {/* Show Update Framework button on step 3 */}
        {currentStep === 3 && onUpdateFramework && (
          <Button 
            onClick={onUpdateFramework} 
            disabled={isLoading || isNextDisabled} 
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm"
          >
            {isLoading ? "Updating..." : "Update Framework"}
          </Button>
        )}
        
        {/* Final step save button */}
        {!showOnlyUpdateFramework && currentStep === totalSteps && (
          <Button 
            onClick={onSave} 
            disabled={isLoading || isNextDisabled} 
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm"
          >
            {isLoading ? "Saving..." : "Save Screen"}
          </Button>
        )}
        
        {/* Next step button for intermediate steps */}
        {!showOnlyUpdateFramework && currentStep < totalSteps && (
          <Button 
            onClick={onNext} 
            disabled={isLoading || isNextDisabled} 
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm"
          >
            {isLoading ? "Saving..." : "Next"}
          </Button>
        )}
      </div>
      
      {!showOnlyUpdateFramework && <div className="w-[80px]"></div>}
    </div>
  );
}
