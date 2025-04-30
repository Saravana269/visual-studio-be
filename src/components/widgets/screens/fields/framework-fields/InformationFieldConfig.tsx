
import React from "react";
import { Label } from "@/components/ui/label";

interface InformationFieldConfigProps {
  frameworkConfig: Record<string, any>;
  onUpdateMetadata: (updates: Record<string, any>) => void;
}

export function InformationFieldConfig({
  frameworkConfig,
  onUpdateMetadata
}: InformationFieldConfigProps) {
  // Extract configuration value with fallback
  const infoText = frameworkConfig.text || "";

  return (
    <div className="space-y-2">
      <Label htmlFor="info-text">Information Text</Label>
      <textarea
        id="info-text"
        value={infoText}
        onChange={(e) => onUpdateMetadata({ text: e.target.value })}
        className="w-full h-32 p-2 bg-gray-950 border border-gray-800 rounded-md text-white"
        placeholder="Enter information text here..."
      />
    </div>
  );
}
