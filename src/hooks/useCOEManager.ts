
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { COE } from "@/hooks/useCOEData";

export const useCOEManager = () => {
  const { toast } = useToast();
  
  // State management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCOE, setSelectedCOE] = useState<COE | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tagDialogMode, setTagDialogMode] = useState<'add' | 'remove'>('add');
  const [tagSelections, setTagSelections] = useState<Record<string, boolean>>({});
  const [isAssignTagDialogOpen, setIsAssignTagDialogOpen] = useState(false);
  const [selectedTagInDialog, setSelectedTagInDialog] = useState<string | null>(null);
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch tag details
  const { data: tagDetails = {}, refetch: refetchTags } = useQuery({
    queryKey: ["coe-tag-details"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("tags").select("id, label").eq("entity_type", "COE");
        if (error) {
          console.error("Error fetching tag details:", error);
          return {};
        }
        return data.reduce((acc: Record<string, string>, tag) => {
          acc[tag.id] = tag.label;
          return acc;
        }, {});
      } catch (error) {
        console.error("Error fetching tag details:", error);
        return {};
      }
    }
  });

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
  
  const handleSaveTags = async () => {
    if (!selectedCOE) return;
    
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
  
  const handleAssignTag = (coe: COE) => {
    setSelectedCOE(coe);
    setSelectedTagInDialog(coe.primary_tag_id || "");
    setIsAssignTagDialogOpen(true);
  };
  
  const handleSaveTag = async () => {
    if (!selectedCOE) return;
    setIsSubmittingTag(true);
    
    try {
      const tagValue = selectedTagInDialog === "" ? null : selectedTagInDialog;
      const { error } = await supabase.from("class_of_elements")
        .update({ primary_tag_id: tagValue })
        .eq("id", selectedCOE.id);
        
      if (error) {
        console.error("Database error when updating tag:", error);
        throw error;
      }
      
      toast({
        title: "Tag updated",
        description: selectedTagInDialog ? "Tag has been assigned to the COE." : "Tag has been removed from the COE."
      });
      
      setIsAssignTagDialogOpen(false);
      setIsSubmittingTag(false);
      return true;
    } catch (error: any) {
      console.error("Error updating tag:", error);
      toast({
        title: "Error updating tag",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      setIsSubmittingTag(false);
      return false;
    }
  };
  
  // Handle tag selection/filtering
  const handleTagSelect = (tagId: string) => {
    if (tagId) {
      setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
      setCurrentPage(1);
    }
  };
  
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagId));
    setCurrentPage(1);
  };
  
  const handleTagClear = () => {
    setSelectedTags([]);
    setCurrentPage(1);
  };
  
  const handleTagCreated = (newTag: string) => {
    refetchTags();
    toast({
      title: "Tag created",
      description: `Tag "${newTag}" has been created successfully.`
    });
  };
  
  return {
    // State
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedCOE,
    setSelectedCOE,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    isTagDialogOpen,
    setIsTagDialogOpen,
    tagDialogMode,
    tagSelections,
    isAssignTagDialogOpen,
    setIsAssignTagDialogOpen,
    selectedTagInDialog,
    setSelectedTagInDialog,
    isSubmittingTag,
    isCreateTagDialogOpen,
    setIsCreateTagDialogOpen,
    currentPage,
    setCurrentPage,
    tagDetails,
    
    // Functions
    handleManageTags,
    handleTagSelectionChange,
    handleSaveTags,
    handleAssignTag,
    handleSaveTag,
    handleTagSelect,
    handleTagRemove,
    handleTagClear,
    handleTagCreated
  };
};
