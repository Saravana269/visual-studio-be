
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface YesNoFieldConfigProps {
  frameworkConfig?: Record<string, any>;
  onUpdateMetadata?: (updates: Record<string, any>) => void;
}

export function YesNoFieldConfig({
  frameworkConfig = {},
  onUpdateMetadata
}: YesNoFieldConfigProps = {}) {
  // Convert string values to boolean for the toggle
  const [isEnabled, setIsEnabled] = useState<boolean>(
    frameworkConfig.value === true || 
    frameworkConfig.value === "yes" || 
    frameworkConfig.value === "true"
  );

  // Update local state when frameworkConfig changes (for real-time updates)
  useEffect(() => {
    setIsEnabled(
      frameworkConfig.value === true || 
      frameworkConfig.value === "yes" || 
      frameworkConfig.value === "true"
    );
  }, [frameworkConfig]);

  // Handle the toggle change
  const handleToggleChange = (checked: boolean) => {
    setIsEnabled(checked);
    if (onUpdateMetadata) {
      onUpdateMetadata({ value: checked ? true : false });
    }
  };

  // Handle button selection
  const handleButtonSelect = (value: boolean | null) => {
    setIsEnabled(value === true);
    if (onUpdateMetadata) {
      onUpdateMetadata({ value });
    }
  };

  return (
    <div className="space-y-4">
      <Label>Yes/No Configuration</Label>
      <p className="text-sm text-gray-400">This framework type presents a simple Yes/No choice to the user.</p>
      
      {onUpdateMetadata && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-toggle">Toggle Default Value</Label>
            <div className="flex items-center gap-4 p-3 border border-gray-800 rounded-md bg-black/30">
              <Switch 
                id="default-toggle"
                checked={isEnabled} 
                onCheckedChange={handleToggleChange}
              />
              <Label htmlFor="default-toggle" className="text-sm">
                {isEnabled ? 'Yes (On)' : 'No (Off)'}
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              Set the default state for the Yes/No toggle
            </p>
          </div>

          <div className="flex flex-col space-y-2 mt-4">
            <Label>Or select a button</Label>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-md ${
                  frameworkConfig.value === true || frameworkConfig.value === "yes" || frameworkConfig.value === "true" 
                    ? 'bg-green-600 text-white' 
                    : 'bg-black/30 border border-gray-800'
                }`}
                onClick={() => handleButtonSelect(true)}
                type="button"
              >
                Yes
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  frameworkConfig.value === false || frameworkConfig.value === "no" 
                    ? 'bg-red-600 text-white' 
                    : 'bg-black/30 border border-gray-800'
                }`}
                onClick={() => handleButtonSelect(false)}
                type="button"
              >
                No
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  frameworkConfig.value === null 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-black/30 border border-gray-800'
                }`}
                onClick={() => handleButtonSelect(null)}
                type="button"
              >
                No Default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
