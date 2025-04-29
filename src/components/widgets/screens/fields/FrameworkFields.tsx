
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OptionsList } from "./OptionsList";

interface FrameworkFieldsProps {
  frameworkType: string;
  fieldOptions: string[];
  rangeMin: number;
  rangeMax: number;
  rangeStep: number;
  onUpdateMetadata: (updates: Record<string, any>) => void;
}

export function FrameworkFields({
  frameworkType,
  fieldOptions = [],
  rangeMin = 0,
  rangeMax = 100,
  rangeStep = 1,
  onUpdateMetadata
}: FrameworkFieldsProps) {
  // Handle adding and removing options via the child component
  const handleOptionsChange = (updatedOptions: string[]) => {
    onUpdateMetadata({ field_options: updatedOptions });
  };

  switch (frameworkType) {
    case "Multiple Options":
    case "Single Choice":
      return (
        <div className="space-y-2">
          <Label>Options</Label>
          <OptionsList 
            options={fieldOptions} 
            onChange={handleOptionsChange} 
          />
        </div>
      );
      
    case "Slider":
    case "Range Selector":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="range-min">Minimum Value</Label>
              <Input
                id="range-min"
                type="number"
                value={rangeMin}
                onChange={(e) => onUpdateMetadata({ range_min: Number(e.target.value) })}
                className="bg-gray-950 border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="range-max">Maximum Value</Label>
              <Input
                id="range-max"
                type="number"
                value={rangeMax}
                onChange={(e) => onUpdateMetadata({ range_max: Number(e.target.value) })}
                className="bg-gray-950 border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="range-step">Step Size</Label>
              <Input
                id="range-step"
                type="number"
                value={rangeStep}
                onChange={(e) => onUpdateMetadata({ range_step: Number(e.target.value) })}
                className="bg-gray-950 border-gray-800"
              />
            </div>
          </div>
        </div>
      );
      
    case "Yes/No":
      return (
        <div className="space-y-2">
          <Label>Default values are Yes/No</Label>
          <p className="text-sm text-gray-400">This framework type presents a simple Yes/No choice to the user.</p>
        </div>
      );
      
    case "Text Input":
      return (
        <div className="space-y-2">
          <Label>Text Input Configuration</Label>
          <p className="text-sm text-gray-400">Users will be presented with a text field to enter their response.</p>
        </div>
      );
      
    case "Image Upload":
      return (
        <div className="space-y-2">
          <Label>Image Upload Configuration</Label>
          <p className="text-sm text-gray-400">Users will be able to upload an image in supported formats.</p>
        </div>
      );
      
    case "Class of Elements":
      return (
        <div className="space-y-2">
          <Label>Class of Elements Selection</Label>
          <p className="text-sm text-gray-400">This will display available classes of elements for selection.</p>
        </div>
      );
      
    default:
      return null;
  }
}
