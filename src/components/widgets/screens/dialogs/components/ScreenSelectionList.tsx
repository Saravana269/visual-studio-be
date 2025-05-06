
import React from "react";
import { Screen } from "@/types/screen";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ScreenSelectionListProps {
  screens: Screen[];
  isLoading: boolean;
  selectedScreenId: string | null;
  onSelectScreen: (screenId: string) => void;
}

export function ScreenSelectionList({ 
  screens, 
  isLoading, 
  selectedScreenId, 
  onSelectScreen 
}: ScreenSelectionListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-sm text-gray-400">Loading screens...</p>
      </div>
    );
  }

  if (screens.length === 0) {
    return <p className="text-sm text-gray-400 p-2">No other screens found for this widget.</p>;
  }

  return (
    <RadioGroup value={selectedScreenId || ""} onValueChange={onSelectScreen}>
      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
        {screens.map(screen => (
          <div 
            key={screen.id} 
            className={`flex items-start space-x-2 p-3 rounded-md border ${
              selectedScreenId === screen.id 
                ? 'bg-[#00FF00]/10 border-[#00FF00]' 
                : 'border-gray-800 hover:bg-gray-900'
            }`}
          >
            <RadioGroupItem id={`screen-${screen.id}`} value={screen.id} className="mt-0.5" />
            <div className="flex-grow">
              <Label 
                htmlFor={`screen-${screen.id}`} 
                className={`font-medium text-sm ${selectedScreenId === screen.id ? 'text-[#00FF00]' : 'text-white'}`}
              >
                {screen.name}
              </Label>
              <div className="text-xs text-gray-400 mt-1">
                {screen.framework_type || "No framework"}
              </div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                {screen.description || "No description"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
