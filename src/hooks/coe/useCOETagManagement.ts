
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { COE } from "@/hooks/useCOEData";

export const useCOETagManagement = () => {
  const { toast } = useToast();
  
  // COE Tag management state
  const [selectedCOE, setSelectedCOE] = useState<COE | null>(null);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tagDialogMode, setTagDialogMode] = useState<'add' | 'remove'>('add');
  const [tagSelections, setTagSelections] = useState<Record<string, boolean>>({});
  
  // Tag management functions
  const handleManageTags = (coe: COE, action: 'add' | 'remove') => {
    setSelectedCOE(coe);
    setTagDialogMode(action);
    const selections: Record<string, boolean> = {};
    
    if (action === 'add') {
      (coe.tags || []).forEach(tag => {
        selections[tag] = false;
      });
    } else {
      (coe.tags || []).forEach(tag => {
        selections[tag] = false;
      });
    }
    
    setTagSelections(selections);
    setIsTagDialogOpen(true);
  };
  
  const handleTagSelectionChange = (tag: string, checked: boolean) => {
    setTagSelections(prev => ({
      ...prev,
      [tag]: checked
    }));
  };
  
  const handleSaveTags = async (): Promise<boolean> => {
    if (!selectedCOE) return false;
    
    try {
      const selectedTagsList = Object.entries(tagSelections)
                                  .filter(([_, selected]) => selected)
                                  .map(([tag]) => tag);
                                  
      let updatedTags: string[] = [...(selectedCOE.tags || [])];
      
      if (tagDialogMode === 'add') {
        updatedTags = [...new Set([...updatedTags, ...selectedTagsList])];
      } else {
        updatedTags = updatedTags.filter(tag => !selectedTagsList.includes(tag));
      }
      
      const { error } = await supabase.from("class_of_elements")
                                  .update({ tags: updatedTags })
                                  .eq("id", selectedCOE.id);
                                  
      if (error) throw error;
      
      toast({
        title: "Tags updated",
        description: tagDialogMode === 'add' ? "Tags have been added." : "Tags have been removed."
      });
      
      setIsTagDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Error updating tags:", error);
      toast({
        title: "Error updating tags",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    selectedCOE,
    setSelectedCOE,
    isTagDialogOpen,
    setIsTagDialogOpen,
    tagDialogMode,
    tagSelections,
    handleManageTags,
    handleTagSelectionChange,
    handleSaveTags
  };
};
