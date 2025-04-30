
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OptionsList } from "./OptionsList";

interface FrameworkFieldsProps {
  frameworkType: string;
  frameworkConfig: Record<string, any>;
  onUpdateMetadata: (updates: Record<string, any>) => void;
}

export function FrameworkFields({
  frameworkType,
  frameworkConfig = {},
  onUpdateMetadata
}: FrameworkFieldsProps) {
  // Extract configuration values with fallbacks
  const options = frameworkConfig.options || [];
  const minValue = frameworkConfig.min || 0;
  const maxValue = frameworkConfig.max || 100;
  const stepValue = frameworkConfig.step || 1;
  const infoText = frameworkConfig.text || "";
  const imageUrl = frameworkConfig.image_url || "";
  const coeId = frameworkConfig.coe_id || "";

  // Handle adding and removing options via the child component
  const handleOptionsChange = (updatedOptions: string[]) => {
    onUpdateMetadata({ options: updatedOptions });
  };

  switch (frameworkType) {
    case "Multiple Options":
    case "Radio Button":
      return (
        <div className="space-y-2">
          <Label>Options</Label>
          <OptionsList 
            options={options} 
            onChange={handleOptionsChange} 
          />
        </div>
      );
      
    case "Slider":
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
    
    case "Information":
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
      
    case "Yes / No":
      return (
        <div className="space-y-2">
          <Label>Default values are Yes/No</Label>
          <p className="text-sm text-gray-400">This framework type presents a simple Yes/No choice to the user.</p>
        </div>
      );
      
    case "Image Upload":
      return (
        <div className="space-y-2">
          <Label>Image Upload Configuration</Label>
          <p className="text-sm text-gray-400">Users will be able to upload an image in supported formats.</p>
        </div>
      );
      
    case "COE Manager":
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
