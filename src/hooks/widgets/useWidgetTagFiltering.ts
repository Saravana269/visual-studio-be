
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function useWidgetTagFiltering() {
  const { toast } = useToast();
  const { session } = useAuth();
  
  // Handle tag selection for filtering
  const handleTagSelect = (selectedTagIds: string[], tagId: string) => {
    if (!selectedTagIds.includes(tagId)) {
      return [...selectedTagIds, tagId];
    }
    return selectedTagIds;
  };

  // Handle tag removal for filtering
  const handleTagRemove = (selectedTagIds: string[], tagId: string) => {
    return selectedTagIds.filter(id => id !== tagId);
  };

  // Handle clearing all selected tags
  const handleTagClear = () => {
    return [];
  };

  // Create sample tags for the Widget Manager
  const createSampleTags = async () => {
    const userId = session?.user?.id;
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create tags",
        variant: "destructive",
      });
      return false;
    }

    const sampleTags = [
      { label: "Dashboard", entity_type: "Widget" },
      { label: "Form", entity_type: "Widget" },
      { label: "Analytics", entity_type: "Widget" },
      { label: "Configuration", entity_type: "Widget" },
      { label: "User Interface", entity_type: "Widget" }
    ];

    try {
      // Check if sample tags already exist to avoid duplicates
      const { data: existingTags } = await supabase
        .from("tags")
        .select("label")
        .eq("entity_type", "Widget");
      
      const existingLabels = existingTags?.map(tag => tag.label.toLowerCase()) || [];
      
      // Filter out tags that already exist
      const tagsToCreate = sampleTags.filter(
        tag => !existingLabels.includes(tag.label.toLowerCase())
      );
      
      if (tagsToCreate.length === 0) {
        toast({
          title: "Sample tags already exist",
          description: "The sample tags have already been created",
        });
        return true;
      }

      // Prepare tags with required fields
      const tagsData = tagsToCreate.map(tag => ({
        label: tag.label,
        entity_type: tag.entity_type,
        created_by: userId,
        entity_id: "00000000-0000-0000-0000-000000000000" // Placeholder value as required
      }));

      // Insert the tags
      const { error } = await supabase
        .from("tags")
        .insert(tagsData);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Created ${tagsToCreate.length} sample tags for widgets`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error creating sample tags:", error);
      toast({
        title: "Error",
        description: "Failed to create sample tags. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleTagSelect,
    handleTagRemove,
    handleTagClear,
    createSampleTags
  };
}
