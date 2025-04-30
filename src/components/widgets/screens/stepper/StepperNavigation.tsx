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
  isEditing
}: StepperNavigationProps) {
  return <div className="border-t border-gray-800 p-4 flex justify-between">
      <Button onClick={onPrevious} disabled={isPreviousDisabled} className="bg-gray-800 hover:bg-gray-700 text-white">
        Previous
      </Button>
      
      <div className="flex gap-2">
        {/* Show Update Framework button on step 3 */}
        {currentStep === 3 && onUpdateFramework && <Button onClick={onUpdateFramework} disabled={isLoading || isNextDisabled} className="bg-blue-600 hover:bg-blue-500 text-white">
            {isLoading ? "Updating..." : "Update Framework"}
          </Button>}
        
        {currentStep === totalSteps}
        
        {currentStep < totalSteps}
      </div>
    </div>;
}