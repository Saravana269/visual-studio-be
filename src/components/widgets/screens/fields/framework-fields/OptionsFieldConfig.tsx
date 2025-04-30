
import React from "react";
import { Label } from "@/components/ui/label";
import { OptionsList } from "../OptionsList";

interface OptionsFieldConfigProps {
  frameworkConfig: Record<string, any>;
  onUpdateMetadata: (updates: Record<string, any>) => void;
}

export function OptionsFieldConfig({
  frameworkConfig,
  onUpdateMetadata
}: OptionsFieldConfigProps) {
  // Extract options with fallback
  const options = frameworkConfig.options || [];

  // Handle adding and removing options via the child component
  const handleOptionsChange = (updatedOptions: string[]) => {
    onUpdateMetadata({ options: updatedOptions });
  };

  return (
    <div className="space-y-2">
      <Label>Options</Label>
      <OptionsList 
        options={options} 
        onChange={handleOptionsChange} 
      />
    </div>
  );
}
