
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function TagSelector({ value, onChange }: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("");

  // Fetch all existing tags for autocomplete
  const { data: existingTags } = useQuery({
    queryKey: ["all-element-tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("elements")
        .select("tags");
      
      if (error || !data) return [];
      
      // Extract all tags and remove duplicates
      const allTags = data.flatMap(item => item.tags || []);
      return [...new Set(allTags)];
    }
  });

  // Filter suggestions based on input
  const suggestions = existingTags?.filter(
    tag => tag.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(tag)
  ).slice(0, 5);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !value.includes(tag.trim())) {
      onChange([...value, tag.trim()]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove the last tag when pressing Backspace with empty input
      onChange(value.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {value.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-xs"
          >
            {tag}
            <X 
              size={14} 
              className="cursor-pointer" 
              onClick={() => handleRemoveTag(tag)} 
            />
          </Badge>
        ))}
        <Input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[120px] h-8 px-2 py-1 text-sm"
          placeholder="Add tag..."
        />
      </div>

      {suggestions && suggestions.length > 0 && inputValue && (
        <div className="p-1 border rounded-md bg-background">
          {suggestions.map(tag => (
            <div 
              key={tag}
              className="px-2 py-1 text-sm cursor-pointer hover:bg-accent rounded"
              onClick={() => handleAddTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
