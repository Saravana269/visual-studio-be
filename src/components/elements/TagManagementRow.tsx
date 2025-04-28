
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

interface TagManagementRowProps {
  selectedTags: string[];
  onTagSearch: (query: string) => void;
  onTagRemove: (tag: string) => void;
  onAddTagClick: () => void;
  onManageTagsClick: () => void;
}

export function TagManagementRow({
  selectedTags,
  onTagSearch,
  onTagRemove,
  onAddTagClick,
  onManageTagsClick,
}: TagManagementRowProps) {
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch tags from both elements arrays and the tags table
  const { data: availableTags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ["available-tags"],
    queryFn: async () => {
      try {
        // 1. Fetch tags from elements table arrays
        const { data: elementsData, error: elementsError } = await supabase
          .from("elements")
          .select("tags");
          
        if (elementsError) {
          toast({
            title: "Error fetching element tags",
            description: elementsError.message,
            variant: "destructive",
          });
          return [];
        }
        
        // 2. Fetch tags from the dedicated tags table
        const { data: tagsData, error: tagsError } = await supabase
          .from("tags")
          .select("label")
          .eq("entity_type", "elements");
        
        if (tagsError) {
          toast({
            title: "Error fetching tags",
            description: tagsError.message,
            variant: "destructive",
          });
          // Continue with element tags even if tags table query fails
        }
        
        // Extract all unique tags from elements
        const elementTags = elementsData?.flatMap((item) => item.tags || []) || [];
        
        // Extract labels from tags table
        const dedicatedTags = tagsData?.map(tag => tag.label) || [];
        
        // Combine both sources and remove duplicates
        const allTags = [...elementTags, ...dedicatedTags];
        return [...new Set(allTags)].filter(tag => tag && tag.trim() !== "");
      } catch (error: any) {
        console.error("Error fetching available tags:", error);
        toast({
          title: "Error fetching tags",
          description: "Failed to load available tags",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  // Filter tags based on search query
  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagSearchQuery.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      // Call parent's function to add the tag to selected tags
      onTagSearch(tag); // This will update the search query to find the tag
      // Alternative approach would be to directly add the tag to selected tags with a new callback
    }
  };

  const handleTagCreated = (newTag: string) => {
    // The parent component will handle refreshing the tags list
    onAddTagClick();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            className="pl-9"
            value={tagSearchQuery}
            onChange={(e) => {
              setTagSearchQuery(e.target.value);
              onTagSearch(e.target.value);
            }}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateTagDialogOpen(true)}
            className="flex items-center gap-2 bg-[#8B4A2B] hover:bg-[#6D3A22] border-[#F97316] text-white"
          >
            <Plus size={16} />
            Tag
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onManageTagsClick}
            className="flex items-center justify-center w-9 h-9"
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>

      {/* Horizontal scrollable tag list */}
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex items-center gap-2 py-2">
            {isLoadingTags ? (
              <div className="text-sm text-muted-foreground px-2">Loading tags...</div>
            ) : filteredTags.length > 0 ? (
              <>
                <Tag size={16} className="text-muted-foreground ml-1 flex-shrink-0" />
                <div className="flex gap-2">
                  {filteredTags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-[#F4E4D8] hover:bg-[#F8C9A8] text-[#8B4A2B] cursor-pointer transition-colors px-3 py-1"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            ) : tagSearchQuery ? (
              <div className="text-sm text-muted-foreground px-2">No matching tags found</div>
            ) : (
              <div className="text-sm text-muted-foreground px-2 flex items-center gap-1">
                <Tag size={16} /> Available tags will appear here
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              className="tag-badge flex items-center gap-1 px-3 py-1"
            >
              {tag}
              <button
                onClick={() => onTagRemove(tag)}
                className="ml-1 hover:bg-[#E5946C] rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
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
