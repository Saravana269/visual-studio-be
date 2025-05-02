
import React from "react";
import { Label } from "@/components/ui/label";

interface COEManagerFieldConfigProps {
  frameworkConfig: Record<string, any>;
  onUpdateMetadata: (updates: Record<string, any>) => void;
}

export function COEManagerFieldConfig({
  frameworkConfig,
  onUpdateMetadata
}: COEManagerFieldConfigProps) {
  return (
    <div className="space-y-2">
      <Label>Class of Elements Selection</Label>
      <p className="text-sm text-gray-400">This will display available classes of elements for selection.</p>
    </div>
  );
}
