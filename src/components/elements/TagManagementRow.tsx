
import { Search, Plus, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { CreateTagDialog } from "./CreateTagDialog";

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
            onChange={(e) => onTagSearch(e.target.value)}
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
