
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ConnectionBadge } from "../connections/ConnectionBadge";

interface RadioButtonContentProps {
  metadata: Record<string, any>;
  screenId?: string;
  onConnect?: (option: string) => void;
}

export function RadioButtonContent({ metadata, screenId, onConnect }: RadioButtonContentProps) {
  // Get options from metadata
  const options = metadata.options || [];
  
  // State for selected value
  const [value, setValue] = useState<string | null>(null);
  
  // State for tracking connections
  const [connectedOption, setConnectedOption] = useState<string | null>(null);
  
  // Handle radio selection
  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    
    // If onConnect is provided, call it with the selected option
    if (onConnect) {
      onConnect(newValue);
      setConnectedOption(newValue);
    }
  };
  
  // Handle connection view
  const handleViewConnection = () => {
    console.log("View connection for", connectedOption);
  };

  return (
    <div className="space-y-4 mt-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-300">Radio Button Selection</h3>
        
        {connectedOption && (
          <ConnectionBadge 
            type="option"
            label={connectedOption}
            connectionId={`radio_${connectedOption}`} 
            onViewConnection={handleViewConnection} 
          />
        )}
      </div>
      
      {options.length > 0 ? (
        <div className="border border-[#00FF00]/20 bg-black/30 p-4 rounded">
          <RadioGroup value={value || undefined} onValueChange={handleValueChange}>
            <div className="space-y-3">
              {options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-sm cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      ) : (
        <div className="text-gray-500 italic border border-[#00FF00]/20 bg-black/30 p-4 rounded">
          No options defined
        </div>
      )}
    </div>
  );
}
