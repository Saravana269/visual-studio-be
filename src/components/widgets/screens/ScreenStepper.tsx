
import { CheckIcon } from "lucide-react";

interface ScreenStepperProps {
  totalSteps: number;
  currentStep: number;
}

export function ScreenStepper({ totalSteps, currentStep }: ScreenStepperProps) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div 
            key={index} 
            className={`flex items-center ${index !== totalSteps - 1 ? "flex-1" : ""}`}
          >
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${isActive ? "bg-[#00FF00] text-black" : 
                  isCompleted ? "bg-[#00FF00]/20 text-[#00FF00]" : 
                  "bg-gray-800 text-gray-400"}
              `}
            >
              {isCompleted ? <CheckIcon size={16} /> : index + 1}
            </div>
            
            {index !== totalSteps - 1 && (
              <div 
                className={`h-[2px] flex-1 mx-2 
                  ${index < currentStep ? "bg-[#00FF00]/50" : "bg-gray-800"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
