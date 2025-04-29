
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { CreateTagDialog } from "./CreateTagDialog";
import { TagSearch } from "./TagSearch";
import { TagList } from "./TagList";
import { TagActions } from "./TagActions";

// Define the allowed entity types
export type EntityType = "Element" | "COE";

interface TagManagementRowProps {
  selectedTag?: string | null;
  selectedTags?: string[];
  tagDetails?: Record<string, string>;
  onTagSearch: (query: string) => void;
  onTagSelect?: (tagId: string) => void;
  onTagRemove?: (tag: string) => void;
  onTagClear?: () => void;
  onAddTagClick: () => void;
  onManageTagsClick?: () => void;
  entityType?: EntityType;
}

export function TagManagementRow({
  selectedTag,
  selectedTags,
  tagDetails = {},
  onTagSearch,
  onTagSelect,
  onTagRemove,
  onTagClear,
  onAddTagClick,
  onManageTagsClick,
  entityType = "Element"
}: TagManagementRowProps) {
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const { toast } = useToast();
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Determine if we're in single or multiple tag mode
  const isSingleMode = selectedTag !== undefined;

  // Fetch all available tags
  const {
    data: availableTags = [],
    isLoading: isLoadingTags,
    refetch
  } = useQuery({
    queryKey: ["available-tags", userId, entityType],
    queryFn: async () => {
      try {
        // Fetch tags from the tags table
        const { data: tagsData, error: tagsError } = await supabase
          .from("tags")
          .select("id, label")
          .eq("entity_type", entityType);
          
        if (tagsError) {
          toast({
            title: "Error fetching tags",
            description: tagsError.message,
            variant: "destructive"
          });
          return [];
        }

        return tagsData || [];
      } catch (error: any) {
        console.error("Error fetching available tags:", error);
        toast({
          title: "Error fetching tags",
          description: "Failed to load available tags",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!userId // Only run the query if the user is authenticated
  });

  // Filter tags based on search query
  let filteredTags = tagSearchQuery
    ? availableTags.filter(tag => 
        tag.label.toLowerCase().includes(tagSearchQuery.toLowerCase()))
    : availableTags;

  // Further filter to remove already selected tags
  if (isSingleMode && selectedTag) {
    filteredTags = filteredTags.filter(tag => tag.id !== selectedTag);
  } else if (!isSingleMode && selectedTags && selectedTags.length > 0) {
    filteredTags = filteredTags.filter(tag => !selectedTags.includes(tag.id));
  }

  const handleTagClick = (tagId: string) => {
    if (isSingleMode && onTagSelect) {
      onTagSelect(tagId);
    } else if (!isSingleMode && onTagRemove && onTagSelect) {
      // For multiple mode, toggle the tag
      if (selectedTags?.includes(tagId)) {
        onTagRemove(tagId);
      } else {
        onTagSelect(tagId);
      }
    }
    setTagSearchQuery(""); // Clear search after selection
  };

  const handleTagCreated = (newTag: string) => {
    // Refresh the tags list
    refetch();
    // Notify parent that a tag was added
    onAddTagClick();
    toast({
      title: "Tag created",
      description: `Tag "${newTag}" has been created successfully`
    });
  };

  const handleSearchChange = (value: string) => {
    setTagSearchQuery(value);
    onTagSearch(value);
  };

  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {/* Left section: Search input and tag list container */}
      <div className="flex items-center gap-3 flex-grow">
        {/* Search input component */}
        <TagSearch 
          value={tagSearchQuery} 
          onChange={handleSearchChange} 
        />
        
        {/* Tag list component */}
        <TagList 
          selectedTag={selectedTag}
          selectedTags={selectedTags}
          tagDetails={tagDetails}
          filteredTags={filteredTags}
          onTagClick={handleTagClick}
          onTagRemove={onTagRemove}
          onTagClear={onTagClear}
          isLoadingTags={isLoadingTags}
          tagSearchQuery={tagSearchQuery}
          isSingleMode={isSingleMode}
        />
      </div>
      
      {/* Right section: Action buttons */}
      <TagActions 
        onAddTagClick={() => setIsCreateTagDialogOpen(true)}
        onManageTagsClick={onManageTagsClick}
      />

      {/* Create Tag Dialog */}
      <CreateTagDialog 
        open={isCreateTagDialogOpen} 
        onClose={() => setIsCreateTagDialogOpen(false)} 
        onTagCreated={handleTagCreated} 
        entityType={entityType}
      />
    </div>
  );
}
