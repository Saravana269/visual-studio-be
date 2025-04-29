
import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagManagementRow } from "@/components/elements/TagManagementRow";

interface ElementSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTagId: string | null;
  tagDetails: Record<string, string>;
  onAddElementClick: () => void;
  onTagSelect: (tagId: string) => void;
  onTagClear: () => void;
  onTagSearch: (query: string) => void;
  onAddTagClick: () => void;
}

export const ElementSearch: React.FC<ElementSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTagId,
  tagDetails,
  onAddElementClick,
  onTagSelect,
  onTagClear,
  onTagSearch,
  onAddTagClick
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search elements..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={onAddElementClick} className="flex items-center gap-2 bg-[#00B86B] hover:bg-[#00A25F]">
          <Plus size={16} /> Add Element
        </Button>
      </div>

      <TagManagementRow
        selectedTag={selectedTagId}
        tagDetails={tagDetails}
        onTagSelect={onTagSelect}
        onTagClear={onTagClear}
        onTagSearch={onTagSearch}
        onAddTagClick={onAddTagClick}
      />
    </div>
  );
};
