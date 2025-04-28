
import { Search, Plus, Settings, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { CreateTagDialog } from "./CreateTagDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

interface TagManagementRowProps {
  selectedTag: string | null;
  tagDetails: Record<string, string>;
  onTagSearch: (query: string) => void;
  onTagSelect: (tagId: string) => void;
  onTagClear: () => void;
  onAddTagClick: () => void;
  onManageTagsClick?: () => void;
}

export function TagManagementRow({
  selectedTag,
  tagDetails,
  onTagSearch,
  onTagSelect,
  onTagClear,
  onAddTagClick,
  onManageTagsClick
}: TagManagementRowProps) {
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const { toast } = useToast();
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Fetch all available tags
  const {
    data: availableTags = [],
    isLoading: isLoadingTags,
    refetch
  } = useQuery({
    queryKey: ["available-tags", userId],
    queryFn: async () => {
      try {
        // Fetch tags from the tags table
        const { data: tagsData, error: tagsError } = await supabase
          .from("tags")
          .select("id, label")
          .eq("entity_type", "Element");
          
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
  const filteredTags = tagSearchQuery
    ? availableTags.filter(tag => 
        tag.label.toLowerCase().includes(tagSearchQuery.toLowerCase()) && 
        (!selectedTag || tag.id !== selectedTag)
      )
    : availableTags.filter(tag => !selectedTag || tag.id !== selectedTag);

  const handleTagClick = (tagId: string) => {
    onTagSelect(tagId);
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
  const selectedTagLabel = selectedTag && tagDetails[selectedTag];

  return (
    <div className="space-y-4">
      {/* Main row with search on left, tags in middle, buttons on right */}
      <div className="flex items-center gap-3 w-full">
        {/* Search input - fixed width but will shrink if needed */}
        <div className="relative min-w-[180px] max-w-[240px] flex-shrink">
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
        
        {/* Tag list with horizontal scrolling - takes remaining space */}
        <div className="flex-grow overflow-hidden">
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
        </div>
        
        {/* Action buttons container with transparent background and border */}
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
      </div>

      {/* Selected tag section */}
      {selectedTag && (
        <div className="flex items-center gap-2">
          <Badge className="bg-[#FFA130] hover:bg-[#FFA130] text-white flex items-center gap-1 px-3 py-1">
            {selectedTagLabel || 'Unknown Tag'}
            <button onClick={onTagClear} className="ml-1 hover:bg-[#E58A00] rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
          <span className="text-sm text-muted-foreground">Showing elements with this tag only</span>
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
