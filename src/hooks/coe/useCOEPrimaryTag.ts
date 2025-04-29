
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { COE } from "@/hooks/useCOEData";

export const useCOEPrimaryTag = () => {
  const { toast } = useToast();
  
  // Primary tag assignment state
  const [isAssignTagDialogOpen, setIsAssignTagDialogOpen] = useState(false);
  const [selectedTagInDialog, setSelectedTagInDialog] = useState<string | null>(null);
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);
  const [selectedCOE, setSelectedCOE] = useState<COE | null>(null);
  
  const handleAssignTag = (coe: COE) => {
    setSelectedCOE(coe);
    setSelectedTagInDialog(coe.primary_tag_id || "");
    setIsAssignTagDialogOpen(true);
  };
  
  const handleSaveTag = async (): Promise<boolean> => {
    if (!selectedCOE) return false;
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
  
  return {
    isAssignTagDialogOpen,
    setIsAssignTagDialogOpen,
    selectedTagInDialog,
    setSelectedTagInDialog,
    isSubmittingTag,
    selectedCOE,
    setSelectedCOE,
    handleAssignTag,
    handleSaveTag
  };
};
