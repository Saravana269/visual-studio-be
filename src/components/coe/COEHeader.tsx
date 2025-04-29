
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import COESearch from "./COESearch";

interface COEHeaderProps {
  onCreateCOE: () => void;
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

const COEHeader = ({ 
  onCreateCOE, 
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
}: COEHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <COESearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTags={selectedTags}
            tagDetails={tagDetails}
            onTagSelect={onTagSelect}
            onTagRemove={onTagRemove}
            onTagClear={onTagClear}
            onTagSearch={onTagSearch}
            onAddTagClick={onAddTagClick}
            onSettingsClick={onSettingsClick}
          />
        </div>
        
        <Button onClick={onCreateCOE} className="flex items-center gap-2 bg-[#00B86B] hover:bg-[#00A25F] whitespace-nowrap">
          <Plus size={16} /> Create COE
        </Button>
      </div>
    </div>
  );
};

export default COEHeader;
