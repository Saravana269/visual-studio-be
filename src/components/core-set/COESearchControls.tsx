
import { Search, CheckSquare, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface COESearchControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export const COESearchControls = ({
  searchQuery,
  onSearchChange,
  selectedCount,
  onSelectAll,
  onClearSelection,
}: COESearchControlsProps) => {
  return (
    <div className="flex justify-between items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search COEs..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      
      <div>
        {selectedCount > 0 ? (
          <Button size="sm" variant="outline" onClick={onClearSelection} className="gap-2">
            <X className="h-3.5 w-3.5" />
            Clear ({selectedCount})
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={onSelectAll} className="gap-2">
            <CheckSquare className="h-3.5 w-3.5" />
            Select All
          </Button>
        )}
      </div>
    </div>
  );
};
