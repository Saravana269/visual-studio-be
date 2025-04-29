
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScreenFormData } from "@/types/screen";

interface CommonFieldsProps {
  formData: ScreenFormData;
  onFormChange: (field: string, value: string) => void;
  onMetadataChange: (field: string, value: any) => void;
}

export function CommonFields({ 
  formData, 
  onFormChange, 
  onMetadataChange 
}: CommonFieldsProps) {
  // Framework types available in the system
  const frameworkTypes = [
    "Multiple Options", 
    "Single Choice", 
    "Yes/No",
    "Slider",
    "Range Selector",
    "Text Input",
    "Information",
    "Class of Elements",
    "Image Upload"
  ];

  return (
    <>
      {/* Screen name input */}
      <div className="space-y-2">
        <Label htmlFor="screen-name">Screen Name</Label>
        <Input
          id="screen-name"
          value={formData.name}
          onChange={(e) => onFormChange("name", e.target.value)}
          placeholder="Enter screen name"
          className="bg-gray-950 border-gray-800"
        />
      </div>
      
      {/* Screen description input */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormChange("description", e.target.value)}
          placeholder="Enter screen description"
          className="bg-gray-950 border-gray-800"
          rows={2}
        />
      </div>
      
      {/* Framework type select */}
      <div className="space-y-2">
        <Label htmlFor="framework-type">Response Type</Label>
        <select
          id="framework-type"
          value={formData.framework_type}
          onChange={(e) => onFormChange("framework_type", e.target.value)}
          className="w-full p-2 rounded bg-gray-950 border border-gray-800 text-white"
        >
          {frameworkTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      {/* Field name input */}
      <div className="space-y-2">
        <Label htmlFor="field-name">Field Name</Label>
        <Input
          id="field-name"
          value={formData.metadata?.field_name || ""}
          onChange={(e) => onMetadataChange("field_name", e.target.value)}
          placeholder="Enter field name"
          className="bg-gray-950 border-gray-800"
        />
      </div>
      
      {/* Information textarea */}
      <div className="space-y-2">
        <Label htmlFor="information">Information</Label>
        <Textarea
          id="information"
          value={formData.metadata?.information || ""}
          onChange={(e) => onMetadataChange("information", e.target.value)}
          placeholder="Enter additional information"
          className="bg-gray-950 border-gray-800"
          rows={4}
        />
      </div>
    </>
  );
}
