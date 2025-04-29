
import React from "react";
import { CommonFields } from "./fields/CommonFields";
import { FrameworkFields } from "./fields/FrameworkFields";
import { ScreenFormData } from "@/types/screen";

interface ScreenFieldEditorProps {
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave?: () => void;
  autoSave?: boolean;
}

export function ScreenFieldEditor({ 
  formData, 
  setFormData, 
  onSave, 
  autoSave = false 
}: ScreenFieldEditorProps) {
  // Extract metadata fields
  const fieldOptions = formData.metadata?.field_options || [];
  const rangeMin = formData.metadata?.range_min || 0;
  const rangeMax = formData.metadata?.range_max || 100;
  const rangeStep = formData.metadata?.range_step || 1;
  
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

  return (
    <div className="space-y-6">
      {/* Common fields like name, description, etc */}
      <CommonFields 
        formData={formData} 
        onFormChange={handleFormChange} 
        onMetadataChange={handleMetadataChange} 
      />
      
      {/* Framework-specific fields */}
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
