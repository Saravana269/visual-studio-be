
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
  
  // Update metadata function - standardized format
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
  
  // Handle framework type change
  const handleFrameworkChange = (value: string) => {
    // When framework type changes, reset metadata to avoid mixing configuration
    let newMetadata = {};
    
    // Set default values based on framework type
    switch (value) {
      case "Multiple Options":
      case "Radio Button":
        newMetadata = { options: [] };
        break;
      case "Slider":
        newMetadata = { min: 0, max: 100, step: 1 };
        break;
      case "Information":
        newMetadata = { text: "" };
        break;
      case "Yes / No":
        newMetadata = { value: null };
        break;
      case "Image Upload":
        newMetadata = { image_url: "" };
        break;
      case "COE Manager":
        newMetadata = { coe_id: null };
        break;
    }
    
    // Update form data with new framework type and clean metadata
    setFormData(prev => ({
      ...prev,
      framework_type: value,
      metadata: newMetadata
    }));
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
        
      case 3: // Framework type step (renamed from "Response Type")
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="framework-type" className="text-xl">Framework Type</Label>
              <Select 
                value={formData.framework_type} 
                onValueChange={handleFrameworkChange}
              >
                <SelectTrigger className="bg-gray-950 border-gray-800 text-lg">
                  <SelectValue placeholder="Select framework type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-950 border-gray-800">
                  {frameworkTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {formData.framework_type && (
              <div className="mt-4">
                <FrameworkFields 
                  frameworkType={formData.framework_type}
                  frameworkConfig={formData.metadata || {}}
                  onUpdateMetadata={updateMetadata}
                />
              </div>
            )}
          </div>
        );
        
      default:
        // Use original editor for fallback
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="screen-name">Screen Name</Label>
              <Input
                id="screen-name"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Enter screen name"
                className="bg-gray-950 border-gray-800"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Enter screen description"
                className="bg-gray-950 border-gray-800"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="framework-type">Framework Type</Label>
              <Select 
                value={formData.framework_type} 
                onValueChange={handleFrameworkChange}
              >
                <SelectTrigger className="bg-gray-950 border-gray-800">
                  <SelectValue placeholder="Select framework type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-950 border-gray-800">
                  {frameworkTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {formData.framework_type && (
              <FrameworkFields 
                frameworkType={formData.framework_type}
                frameworkConfig={formData.metadata || {}}
                onUpdateMetadata={updateMetadata}
              />
            )}
          </div>
        );
    }
  };

  return renderStepContent();
}
