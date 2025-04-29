
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ScreenFormData } from "@/types/screen";

interface ScreenFieldEditorProps {
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
}

export function ScreenFieldEditor({ formData, setFormData }: ScreenFieldEditorProps) {
  // Local state for new option
  const [newOption, setNewOption] = useState("");
  
  // Extract metadata fields
  const fieldName = formData.metadata?.field_name || "";
  const information = formData.metadata?.information || "";
  const fieldOptions = formData.metadata?.field_options || [];
  
  // Update metadata function
  const updateMetadata = (updates: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        ...updates
      }
    }));
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
          <option value="Multiple Options">Multiple Options</option>
          <option value="Single Choice">Single Choice</option>
          <option value="Yes/No">Yes/No</option>
          <option value="Text Input">Text Input</option>
          <option value="Number Input">Number Input</option>
          <option value="Slider">Slider</option>
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
      
      {/* Field options */}
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
    </div>
  );
}
