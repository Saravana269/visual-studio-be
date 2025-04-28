
import { Badge } from "@/components/ui/badge";

interface COETagSearchProps {
  selectedTags: string[];
  allTags: string[];
  onTagSelect: (tag: string) => void;
}

const COETagSearch = ({ 
  selectedTags, 
  allTags, 
  onTagSelect 
}: COETagSearchProps) => {
  return (
    <div className="space-y-4">
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onTagSelect(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default COETagSearch;
