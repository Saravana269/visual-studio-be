
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SliderFieldConfigProps {
  frameworkConfig: Record<string, any>;
  onUpdateMetadata: (updates: Record<string, any>) => void;
}

export function SliderFieldConfig({
  frameworkConfig,
  onUpdateMetadata
}: SliderFieldConfigProps) {
  // Extract configuration values with fallbacks
  const minValue = frameworkConfig.min || 0;
  const maxValue = frameworkConfig.max || 100;
  const stepValue = frameworkConfig.step || 1;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="range-min">Minimum Value</Label>
          <Input
            id="range-min"
            type="number"
            value={minValue}
            onChange={(e) => onUpdateMetadata({ min: Number(e.target.value) })}
            className="bg-gray-950 border-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="range-max">Maximum Value</Label>
          <Input
            id="range-max"
            type="number"
            value={maxValue}
            onChange={(e) => onUpdateMetadata({ max: Number(e.target.value) })}
            className="bg-gray-950 border-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="range-step">Step Size</Label>
          <Input
            id="range-step"
            type="number"
            value={stepValue}
            onChange={(e) => onUpdateMetadata({ step: Number(e.target.value) })}
            className="bg-gray-950 border-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
