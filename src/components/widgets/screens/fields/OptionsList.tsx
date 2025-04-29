
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface OptionsListProps {
  options: string[];
  onChange: (options: string[]) => void;
}

export function OptionsList({ options = [], onChange }: OptionsListProps) {
  const [newOption, setNewOption] = useState("");
  
  const handleAddOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...options, newOption.trim()];
      onChange(updatedOptions);
      setNewOption("");
    }
  };
  
  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    onChange(updatedOptions);
  };
  
  const handleUpdateOption = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    onChange(updatedOptions);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={option}
            onChange={(e) => handleUpdateOption(index, e.target.value)}
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
            <span className="sr-only">Remove option</span>
          </Button>
        </div>
      ))}
      
      <div className="flex items-center space-x-2">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add new option"
          className="bg-gray-950 border-gray-800 flex-1"
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          onClick={handleAddOption}
          variant="outline"
          className="border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]/10"
        >
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}
