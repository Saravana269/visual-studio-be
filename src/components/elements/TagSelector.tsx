
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreateTagDialog } from "./CreateTagDialog";
import { useAuth } from "@/hooks/useAuth";

interface TagSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function TagSelector({ value, onChange }: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Fetch all existing tags for selection
  const { data: availableTags = [], refetch } = useQuery({
    queryKey: ["all-element-tags", userId],
    queryFn: async () => {
      try {
        // Only run query if user is authenticated
        if (!userId) return [];
        
        // Fetch tags from the tags table
        const { data: tagsData, error: tagsError } = await supabase
          .from("tags")
          .select("id, label")
          .eq("entity_type", "Element");
        
        if (tagsError) {
          console.error("Error fetching tags:", tagsError);
          return [];
        }
        
        return tagsData || [];
      } catch (error) {
        console.error("Error in tag fetching:", error);
        return [];
      }
    },
    enabled: !!userId // Only run the query if the user is authenticated
  });

  // Filter suggestions based on input
  const filteredTags = inputValue
    ? availableTags.filter(tag => 
        tag.label.toLowerCase().includes(inputValue.toLowerCase()))
    : availableTags;

  const handleTagCreated = (newTag: string) => {
    // Refresh the tag list
    refetch();
    // Close the dialog
    setIsCreateTagDialogOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-4">
        <Input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
          placeholder="Filter tags..."
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => setIsCreateTagDialogOpen(true)}
        >
          <Plus size={16} />
        </Button>
      </div>

      <RadioGroup 
        value={value || ""} 
        onValueChange={(val) => onChange(val === "" ? null : val)}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem id="no-tag" value="" />
          <Label htmlFor="no-tag">No tag</Label>
        </div>
        
        {filteredTags.map(tag => (
          <div key={tag.id} className="flex items-center space-x-2">
            <RadioGroupItem id={`tag-${tag.id}`} value={tag.id} />
            <Label htmlFor={`tag-${tag.id}`}>{tag.label}</Label>
          </div>
        ))}
      </RadioGroup>

      <CreateTagDialog
        open={isCreateTagDialogOpen}
        onClose={() => setIsCreateTagDialogOpen(false)}
        onTagCreated={handleTagCreated}
      />
    </div>
  );
}
