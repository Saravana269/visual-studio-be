
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ScreenFormData } from "@/types/screen";

interface ScreenFieldEditorProps {
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave?: () => void;
  autoSave?: boolean;
}

export function ScreenFieldEditor({ formData, setFormData, onSave, autoSave = false }: ScreenFieldEditorProps) {
  // Local state for new option
  const [newOption, setNewOption] = useState("");
  
  // Extract metadata fields
  const fieldName = formData.metadata?.field_name || "";
  const information = formData.metadata?.information || "";
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
  
  // Handle adding new option
  const handleAddOption = () => {
    if (newOption.trim()) {
      updateMetadata({
        field_options: [...(fieldOptions || []), newOption.trim()]
      });
      setNewOption("");
    }
  };
  
  // Handle removing an option
  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...fieldOptions];
    updatedOptions.splice(index, 1);
    updateMetadata({ field_options: updatedOptions });
  };

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

  // Get the right fields to show based on framework type
  const renderFrameworkSpecificFields = () => {
    switch (formData.framework_type) {
      case "Multiple Options":
      case "Single Choice":
        return (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {fieldOptions && fieldOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...fieldOptions];
                      updatedOptions[index] = e.target.value;
                      updateMetadata({ field_options: updatedOptions });
                    }}
                    className="bg-gray-950 border-gray-800 flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center space-x-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add new option"
                  className="bg-gray-950 border-gray-800 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddOption}
                  variant="outline"
                  className="border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]/10"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
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
                  onChange={(e) => updateMetadata({ range_min: Number(e.target.value) })}
                  className="bg-gray-950 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="range-max">Maximum Value</Label>
                <Input
                  id="range-max"
                  type="number"
                  value={rangeMax}
                  onChange={(e) => updateMetadata({ range_max: Number(e.target.value) })}
                  className="bg-gray-950 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="range-step">Step Size</Label>
                <Input
                  id="range-step"
                  type="number"
                  value={rangeStep}
                  onChange={(e) => updateMetadata({ range_step: Number(e.target.value) })}
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
  };

  return (
    <div className="space-y-6">
      {/* Screen name input */}
      <div className="space-y-2">
        <Label htmlFor="screen-name">Screen Name</Label>
        <Input
          id="screen-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
          onChange={(e) => setFormData(prev => ({ ...prev, framework_type: e.target.value }))}
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
          value={fieldName}
          onChange={(e) => updateMetadata({ field_name: e.target.value })}
          placeholder="Enter field name"
          className="bg-gray-950 border-gray-800"
        />
      </div>
      
      {/* Information textarea */}
      <div className="space-y-2">
        <Label htmlFor="information">Information</Label>
        <Textarea
          id="information"
          value={information}
          onChange={(e) => updateMetadata({ information: e.target.value })}
          placeholder="Enter additional information"
          className="bg-gray-950 border-gray-800"
          rows={4}
        />
      </div>
      
      {/* Framework-specific fields */}
      {renderFrameworkSpecificFields()}
    </div>
  );
}
