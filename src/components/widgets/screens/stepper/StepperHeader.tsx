
import React from "react";

interface StepperHeaderProps {
  lastSaved: Date | null;
}

export function StepperHeader({ lastSaved }: StepperHeaderProps) {
  return (
    <div className="bg-[#00FF00]/20 p-4 border-b border-[#00FF00]/30">
      <h2 className="text-xl font-medium text-[#00FF00]">Screen Define Area</h2>
      {lastSaved && (
        <div className="text-sm text-gray-400 mt-1">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
