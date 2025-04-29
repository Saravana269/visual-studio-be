
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagManagementRow } from "@/components/elements/TagManagementRow";

interface COESearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  tagDetails: Record<string, string>;
  onTagSelect: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  onTagClear?: () => void;
  onTagSearch: (query: string) => void;
  onAddTagClick: () => void;
  onSettingsClick?: () => void;
}

const COESearch = ({ 
  searchQuery, 
  setSearchQuery,
  selectedTags,
  tagDetails,
  onTagSelect,
  onTagRemove,
  onTagClear,
  onTagSearch,
  onAddTagClick,
  onSettingsClick
}: COESearchProps) => {
  return (
    <div className="space-y-4">
      {/* First row - COE Search */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search COEs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {/* Second row - Tag Management */}
      <TagManagementRow
        selectedTags={selectedTags}
        tagDetails={tagDetails}
        onTagSelect={onTagSelect}
        onTagRemove={onTagRemove}
        onTagClear={onTagClear}
        onTagSearch={onTagSearch}
        onAddTagClick={onAddTagClick}
        onManageTagsClick={onSettingsClick}
      />
    </div>
  );
};

export default COESearch;
