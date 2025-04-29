
import React from "react";
import { CommonFields } from "./fields/CommonFields";
import { FrameworkFields } from "./fields/FrameworkFields";
import { ScreenFormData } from "@/types/screen";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScreenFieldEditorProps {
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave?: () => void;
  autoSave?: boolean;
  currentStepperStep?: number;
}

export function ScreenFieldEditor({ 
  formData, 
  setFormData, 
  onSave, 
  autoSave = false,
  currentStepperStep = 1
}: ScreenFieldEditorProps) {
  // Extract metadata fields
  const fieldOptions = formData.metadata?.field_options || [];
  const rangeMin = formData.metadata?.range_min || 0;
  const rangeMax = formData.metadata?.range_max || 100;
  const rangeStep = formData.metadata?.range_step || 1;
  
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
  
  // Update metadata function
  const updateMetadata = (updates: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        ...updates
      }
    }));
    
    // If autoSave is enabled, trigger save after a short delay
    if (autoSave && onSave) {
      const timer = setTimeout(() => {
        onSave();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  };
  
  // Handle form field changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle metadata field changes
  const handleMetadataChange = (field: string, value: any) => {
    updateMetadata({ [field]: value });
  };

  // Render based on current step
  const renderStepContent = () => {
    switch (currentStepperStep) {
      case 1: // Screen name step
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="screen-name" className="text-xl">Screen Name</Label>
              <Input
                id="screen-name"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Enter screen name"
                className="bg-gray-950 border-gray-800 text-lg"
              />
            </div>
          </div>
        );
        
      case 2: // Description step
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xl">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Enter screen description"
                className="bg-gray-950 border-gray-800 text-lg"
                rows={5}
              />
            </div>
          </div>
        );
        
      case 3: // Framework type step
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="framework-type" className="text-xl">Response Type</Label>
              <Select 
                value={formData.framework_type} 
                onValueChange={(value) => handleFormChange("framework_type", value)}
              >
                <SelectTrigger className="bg-gray-950 border-gray-800 text-lg">
                  <SelectValue placeholder="Select response type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-950 border-gray-800">
                  {frameworkTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 4: // Preview step (empty as requested)
        return (
          <div className="flex items-center justify-center h-[300px] border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">Screen preview will be available here</p>
          </div>
        );
        
      default:
        // Use original editor for fallback
        return (
          <div className="space-y-6">
            <CommonFields 
              formData={formData} 
              onFormChange={handleFormChange} 
              onMetadataChange={handleMetadataChange} 
            />
            
            <FrameworkFields 
              frameworkType={formData.framework_type}
              fieldOptions={fieldOptions}
              rangeMin={rangeMin}
              rangeMax={rangeMax}
              rangeStep={rangeStep}
              onUpdateMetadata={updateMetadata}
            />
          </div>
        );
    }
  };

  return renderStepContent();
}
