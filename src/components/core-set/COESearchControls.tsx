
import { Search } from "lucide-react";
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
    <div className="flex justify-between items-center">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search COEs..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        {selectedCount > 0 ? (
          <Button size="sm" variant="ghost" onClick={onClearSelection}>
            Clear ({selectedCount})
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={onSelectAll}>
            Select All
          </Button>
        )}
      </div>
    </div>
  );
};
