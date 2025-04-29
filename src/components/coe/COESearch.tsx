
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import COETagSearch from "./COETagSearch";

interface COESearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  allTags: string[];
  onTagSelect: (tag: string) => void;
  onAddTagClick?: () => void;
  onSettingsClick?: () => void;
}

const COESearch = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedTags, 
  allTags, 
  onTagSelect,
  onAddTagClick,
  onSettingsClick
}: COESearchProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-shrink-0 w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search COEs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <COETagSearch
            selectedTags={selectedTags}
            allTags={allTags}
            onTagSelect={onTagSelect}
          />
        </div>
        
        {onAddTagClick && (
          <Button 
            onClick={onAddTagClick}
            size="sm" 
            className="flex-shrink-0"
            variant="outline"
          >
            <Plus size={16} /> Add Tag
          </Button>
        )}
        
        {onSettingsClick && (
          <Button
            onClick={onSettingsClick}
            size="sm"
            className="flex-shrink-0"
            variant="outline"
          >
            <Settings size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default COESearch;
