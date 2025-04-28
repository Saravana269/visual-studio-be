
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreateTagDialog } from "./CreateTagDialog";
import { useAuth } from "@/hooks/useAuth";

interface TagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function TagSelector({ value, onChange }: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Fetch all existing tags for autocomplete, combining both sources
  const { data: existingTags, refetch } = useQuery({
    queryKey: ["all-element-tags", userId],
    queryFn: async () => {
      try {
        // Only run query if user is authenticated
        if (!userId) return [];
        
        // Fetch tags from elements table arrays
        const { data: elementsData, error: elementsError } = await supabase
          .from("elements")
          .select("tags");
        
        if (elementsError) {
          console.error("Error fetching element tags:", elementsError);
          return [];
        }
        
        // Fetch tags from dedicated tags table - only those created by current user
        const { data: tagsData, error: tagsError } = await supabase
          .from("tags")
          .select("label")
          .eq("entity_type", "Element")
          .eq("created_by", userId);
        
        if (tagsError) {
          console.error("Error fetching tags from tags table:", tagsError);
          // Continue with element tags if dedicated tags query fails
        }
        
        // Extract all tags and remove duplicates
        const elementTags = elementsData?.flatMap(item => item.tags || []) || [];
        const dedicatedTags = tagsData?.map(tag => tag.label) || [];
        
        const allTags = [...elementTags, ...dedicatedTags];
        return [...new Set(allTags)].filter(tag => tag && tag.trim() !== "");
      } catch (error) {
        console.error("Error in tag fetching:", error);
        return [];
      }
    },
    enabled: !!userId // Only run the query if the user is authenticated
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

  const handleTagCreated = (newTag: string) => {
    // Add the newly created tag to the selected tags
    if (!value.includes(newTag)) {
      onChange([...value, newTag]);
    }
    // Refresh the tag list
    refetch();
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
        <div className="flex gap-2 flex-1">
          <Input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[120px] h-8 px-2 py-1 text-sm"
            placeholder="Add tag..."
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 px-2"
            onClick={() => setIsCreateTagDialogOpen(true)}
          >
            <Plus size={16} />
          </Button>
        </div>
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

      <CreateTagDialog
        open={isCreateTagDialogOpen}
        onClose={() => setIsCreateTagDialogOpen(false)}
        onTagCreated={handleTagCreated}
      />
    </div>
  );
}
