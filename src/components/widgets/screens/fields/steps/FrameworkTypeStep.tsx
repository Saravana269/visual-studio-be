
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FrameworkFields } from "../FrameworkFields";

interface FrameworkTypeStepProps {
  frameworkType: string | null;
  metadata: Record<string, any>;
  onFrameworkChange: (value: string) => void;
  onMetadataUpdate: (key: string, value: any) => void;
}

export function FrameworkTypeStep({
  frameworkType,
  metadata,
  onFrameworkChange,
  onMetadataUpdate
}: FrameworkTypeStepProps) {
  // Framework types available in the system
  const frameworkTypes = [
    "Multiple Options", 
    "Radio Button", 
    "Yes / No",
    "Slider",
    "Information",
    "Image Upload",
    "COE Manager"
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="framework-type" className="text-sm">Framework Type</Label>
        <Select 
          value={frameworkType || ""} 
          onValueChange={onFrameworkChange}
        >
          <SelectTrigger className="bg-gray-950 border-gray-800 text-sm">
            <SelectValue placeholder="Select framework type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-950 border-gray-800">
            {frameworkTypes.map(type => (
              <SelectItem key={type} value={type} className="text-sm">{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {frameworkType && (
        <div className="mt-4">
          <FrameworkFields 
            frameworkType={frameworkType}
            frameworkConfig={metadata || {}}
            onUpdateMetadata={(updates) => {
              // Handle each key-value pair individually
              Object.entries(updates).forEach(([key, value]) => {
                onMetadataUpdate(key, value);
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
