
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
        
      case 3: // Framework type step
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="framework-type" className="text-xl">Response Type</Label>
              <Select 
                value={formData.framework_type} 
                onValueChange={handleFrameworkChange}
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
        
      case 4: // Preview step
        return (
          <div className="flex flex-col space-y-4">
            <div className="p-4 border border-dashed border-gray-700 rounded-lg bg-black/20">
              <h2 className="text-xl font-semibold mb-4">Screen Preview</h2>
              
              <div className="mb-3">
                <h3 className="text-lg font-medium">{formData.name || "Untitled Screen"}</h3>
                {formData.description && (
                  <p className="text-gray-400 mt-1">{formData.description}</p>
                )}
              </div>
              
              <div className="bg-gray-900 p-4 rounded-md border border-gray-800">
                {renderFrameworkPreview()}
              </div>
            </div>
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
              <Label htmlFor="framework-type">Response Type</Label>
              <Select 
                value={formData.framework_type} 
                onValueChange={handleFrameworkChange}
              >
                <SelectTrigger className="bg-gray-950 border-gray-800">
                  <SelectValue placeholder="Select response type" />
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

  // Render framework preview based on type
  const renderFrameworkPreview = () => {
    const metadata = formData.metadata || {};
    
    switch (formData.framework_type) {
      case "Multiple Options":
        return (
          <div className="space-y-2">
            <p className="font-medium text-white mb-2">Select options:</p>
            {(metadata.options || []).length > 0 ? (
              (metadata.options || []).map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-2 border border-gray-700 rounded-md">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>{option}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No options defined</p>
            )}
          </div>
        );
        
      case "Radio Button":
        return (
          <div className="space-y-2">
            <p className="font-medium text-white mb-2">Select one:</p>
            {(metadata.options || []).length > 0 ? (
              (metadata.options || []).map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-2 border border-gray-700 rounded-md">
                  <input type="radio" name="radio-preview" className="w-4 h-4" />
                  <span>{option}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No options defined</p>
            )}
          </div>
        );
        
      case "Slider":
        return (
          <div className="space-y-4">
            <p className="font-medium text-white">Adjust value:</p>
            <div>
              <input 
                type="range" 
                min={metadata.min || 0} 
                max={metadata.max || 100} 
                step={metadata.step || 1}
                className="w-full" 
                defaultValue={(metadata.min + metadata.max) / 2}
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>{metadata.min || 0}</span>
                <span>{metadata.max || 100}</span>
              </div>
            </div>
          </div>
        );
        
      case "Yes / No":
        return (
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2 p-2 border border-gray-700 rounded-md">
              <input type="radio" name="yn-preview" className="w-4 h-4" />
              <span>Yes</span>
            </div>
            <div className="flex items-center space-x-2 p-2 border border-gray-700 rounded-md">
              <input type="radio" name="yn-preview" className="w-4 h-4" />
              <span>No</span>
            </div>
          </div>
        );
        
      case "Information":
        return (
          <div className="p-3 bg-gray-800/50 rounded-md">
            <p className="text-gray-300 whitespace-pre-wrap">{metadata.text || "Information text will appear here"}</p>
          </div>
        );
        
      case "Image Upload":
        return (
          <div className="text-center p-6 border border-dashed border-gray-700 rounded-md">
            <p className="text-gray-400">Drop image here or click to upload</p>
          </div>
        );
        
      case "COE Manager":
        return (
          <div className="p-3 bg-gray-800/50 rounded-md">
            <p className="text-gray-400">Class of Elements selector will appear here</p>
          </div>
        );
        
      default:
        return (
          <p className="text-gray-400">Select a framework type to see preview</p>
        );
    }
  };

  return renderStepContent();
}
