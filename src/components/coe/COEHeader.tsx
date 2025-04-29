
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import COETagSearch from "./COETagSearch";

interface COEHeaderProps {
  onCreateCOE: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  allTags: string[];
  onTagSelect: (tag: string) => void;
  onAddTagClick?: () => void;
}

const COEHeader = ({ 
  onCreateCOE, 
  searchQuery, 
  setSearchQuery,
  selectedTags,
  allTags,
  onTagSelect,
  onAddTagClick
}: COEHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-64 flex-shrink-0">
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
        </div>
        
        <Button onClick={onCreateCOE} className="flex items-center gap-2 bg-[#00B86B] hover:bg-[#00A25F]">
          <Plus size={16} /> Create COE
        </Button>
      </div>
    </div>
  );
};

export default COEHeader;
