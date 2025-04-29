
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tag } from "lucide-react";

interface COETagSearchProps {
  selectedTags: string[];
  allTags: string[];
  onTagSelect: (tag: string) => void;
  className?: string;
}

const COETagSearch = ({ 
  selectedTags, 
  allTags, 
  onTagSelect,
  className = ""
}: COETagSearchProps) => {
  return (
    <div className={`${className}`}>
      {allTags.length > 0 && (
        <div className="relative">
          <ScrollArea className="w-full">
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

export default COETagSearch;
