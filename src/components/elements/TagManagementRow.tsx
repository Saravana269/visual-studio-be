
import { Search, Plus, Settings, Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateTagDialog } from "./CreateTagDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

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
  entityType?: string;
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

  // Get the selected tag label
  const selectedTagLabel = isSingleMode && selectedTag && tagDetails[selectedTag];

  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {/* Left section: Search input and selected/available tags with horizontal scrolling */}
      <div className="flex items-center gap-3 flex-grow overflow-hidden">
        {/* Search input - fixed width but will shrink if needed */}
        <div className="relative min-w-[180px] max-w-[240px] flex-shrink-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tags..." 
            className="pl-9" 
            value={tagSearchQuery} 
            onChange={e => {
              setTagSearchQuery(e.target.value);
              onTagSearch(e.target.value);
            }} 
          />
        </div>
        
        {/* Selected/Available tags with horizontal scrolling */}
        <div className="flex-grow overflow-hidden">
          {(isSingleMode && selectedTag && selectedTagLabel) || 
           (!isSingleMode && selectedTags && selectedTags.length > 0) ? (
            <ScrollArea className="w-full">
              <div className="flex items-center gap-2 py-1">
                <Tag size={16} className="text-muted-foreground ml-1 flex-shrink-0" />
                <div className="flex gap-2 flex-nowrap">
                  {isSingleMode && selectedTag && (
                    <Badge 
                      key={selectedTag} 
                      className="bg-[#FFA130] hover:bg-[#FFA130] text-white flex items-center gap-1 px-3 py-1 whitespace-nowrap"
                    >
                      {selectedTagLabel || 'Unknown Tag'}
                      {onTagClear && (
                        <button 
                          onClick={onTagClear}
                          className="ml-1 hover:bg-[#E58A00] rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  )}
                  {!isSingleMode && selectedTags && selectedTags.map(tagId => (
                    <Badge 
                      key={tagId} 
                      className="bg-[#FFA130] hover:bg-[#FFA130] text-white flex items-center gap-1 px-3 py-1 whitespace-nowrap"
                    >
                      {tagDetails[tagId] || 'Unknown Tag'}
                      {onTagRemove && (
                        <button 
                          onClick={() => onTagRemove(tagId)}
                          className="ml-1 hover:bg-[#E58A00] rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <ScrollArea className="w-full">
              <div className="flex items-center gap-2 py-1">
                {isLoadingTags ? 
                  <div className="text-sm text-muted-foreground px-2">Loading tags...</div> 
                  : filteredTags.length > 0 ? 
                    <>
                      <Tag size={16} className="text-muted-foreground ml-1 flex-shrink-0" />
                      <div className="flex gap-2 flex-nowrap">
                        {filteredTags.map(tag => (
                          <Badge 
                            key={tag.id} 
                            onClick={() => handleTagClick(tag.id)} 
                            className="bg-[#F4E4D8] hover:bg-[#F8C9A8] text-[#8B4A2B] cursor-pointer transition-colors px-3 py-1 whitespace-nowrap rounded-sm"
                          >
                            {tag.label}
                          </Badge>
                        ))}
                      </div>
                    </> 
                  : tagSearchQuery ? 
                    <div className="text-sm text-muted-foreground px-2">No matching tags found</div> 
                    : 
                    <div className="text-sm text-muted-foreground px-2 flex items-center gap-1">
                      <Tag size={16} /> Available tags will appear here
                    </div>
                }
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </div>
      </div>
      
      {/* Right section: Action buttons container */}
      <div className="flex items-center border border-[#FFA130] rounded-md px-3 py-1 flex-shrink-0 bg-[#FFA13010]">
        <Button 
          onClick={() => setIsCreateTagDialogOpen(true)} 
          className="flex items-center gap-2 bg-transparent hover:bg-[#FFA13033] text-[#FFA130] whitespace-nowrap" 
          size="sm" 
          variant="ghost"
        >
          <Plus size={16} />
          Tag
        </Button>
        
        {/* Divider between buttons */}
        <Separator className="mx-2 h-6 bg-[#FFA13030]" orientation="vertical" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onManageTagsClick} 
          className="flex items-center justify-center w-9 h-9 flex-shrink-0 text-[#FFA130] hover:bg-[#FFA13033] bg-transparent"
        >
          <Settings size={18} />
        </Button>
      </div>

      <CreateTagDialog 
        open={isCreateTagDialogOpen} 
        onClose={() => setIsCreateTagDialogOpen(false)} 
        onTagCreated={handleTagCreated} 
        entityType={entityType}
      />
    </div>
  );
}
