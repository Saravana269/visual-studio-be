
import { Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TagListProps {
  selectedTag?: string | null;
  selectedTags?: string[];
  tagDetails: Record<string, string>;
  filteredTags: Array<{ id: string; label: string }>;
  onTagClick: (tagId: string) => void;
  onTagRemove?: (tag: string) => void;
  onTagClear?: () => void;
  isLoadingTags: boolean;
  tagSearchQuery: string;
  isSingleMode: boolean;
}

export function TagList({
  selectedTag,
  selectedTags = [],
  tagDetails,
  filteredTags,
  onTagClick,
  onTagRemove,
  onTagClear,
  isLoadingTags,
  tagSearchQuery,
  isSingleMode
}: TagListProps) {
  return (
    <div className="flex-grow overflow-hidden">
      <ScrollArea className="w-full">
        <div className="flex items-center gap-2 py-1">
          <Tag size={16} className="text-muted-foreground ml-1 flex-shrink-0" />
          
          <div className="flex gap-2 flex-nowrap">
            {/* Selected tag display (single mode) */}
            {isSingleMode && selectedTag && tagDetails[selectedTag] && (
              <Badge 
                key={selectedTag} 
                className="bg-[#FFA130] hover:bg-[#FFA130] text-white flex items-center gap-1 px-3 py-1 whitespace-nowrap"
              >
                {tagDetails[selectedTag] || 'Unknown Tag'}
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
            
            {/* Multiple selected tags display */}
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
            
            {/* Available tags display when no tag is selected */}
            {(!isSingleMode || !selectedTag) && (!selectedTags || selectedTags.length === 0) && (
              <>
                {isLoadingTags ? (
                  <div className="text-sm text-muted-foreground px-2">Loading tags...</div> 
                ) : filteredTags.length > 0 ? (
                  filteredTags.map(tag => (
                    <Badge 
                      key={tag.id} 
                      onClick={() => onTagClick(tag.id)} 
                      className="bg-[#F4E4D8] hover:bg-[#F8C9A8] text-[#8B4A2B] cursor-pointer transition-colors px-3 py-1 whitespace-nowrap rounded-sm"
                    >
                      {tag.label}
                    </Badge>
                  ))
                ) : tagSearchQuery ? (
                  <div className="text-sm text-muted-foreground px-2">No matching tags found</div> 
                ) : (
                  <div className="text-sm text-muted-foreground px-2 flex items-center gap-1">
                    Available tags will appear here
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
