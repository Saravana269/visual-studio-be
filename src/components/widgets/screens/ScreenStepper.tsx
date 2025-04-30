
import { CheckIcon } from "lucide-react";

interface ScreenStepperProps {
  totalSteps: number;
  currentStep: number;
  steps?: string[];
}

export function ScreenStepper({ totalSteps, currentStep, steps }: ScreenStepperProps) {
  return (
    <div className="flex flex-col mb-5">
      <div className="flex items-center justify-between space-x-3 mb-2">
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
                  w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold
                  ${isActive ? "bg-[#00FF00] text-black" : 
                    isCompleted ? "bg-[#00FF00]/20 text-[#00FF00]" : 
                    "bg-black border border-gray-700 text-gray-400"}
                `}
              >
                {isCompleted ? <CheckIcon size={14} /> : index + 1}
              </div>
              
              {index !== totalSteps - 1 && (
                <div 
                  className={`h-[2px] flex-1 mx-1
                    ${index < currentStep ? "bg-[#00FF00]/30" : "bg-gray-700"}`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {steps && (
        <div className="flex justify-between text-xs mb-3">
          {steps.map((label, index) => (
            <div 
              key={index} 
              className={`text-center ${currentStep === index ? "text-[#00FF00] font-medium" : "text-gray-400"}`}
              style={{ width: `${100 / totalSteps}%` }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
