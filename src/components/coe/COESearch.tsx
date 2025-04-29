
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tag } from "lucide-react";

interface COESearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  allTags: string[];
  onTagSelect: (tag: string) => void;
}

const COESearch = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedTags, 
  allTags, 
  onTagSelect 
}: COESearchProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search COEs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {allTags.length > 0 && (
        <div className="relative">
          <ScrollArea className="w-full pb-4">
            <div className="flex items-center gap-2 py-1 flex-nowrap">
              <Tag size={16} className="text-muted-foreground ml-1 flex-shrink-0" />
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => onTagSelect(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default COESearch;
