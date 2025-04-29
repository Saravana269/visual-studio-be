
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface COETagSearchProps {
  selectedTags: string[];
  allTags: string[];
  onTagSelect: (tag: string) => void;
}

const COETagSearch: React.FC<COETagSearchProps> = ({
  selectedTags,
  allTags,
  onTagSelect,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Filter by Tags</h3>
      <div className="relative">
        <ScrollArea className="w-full pb-4">
          <div className="flex items-center gap-2 py-1">
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
            {selectedTags.length > 0 && (
              <Badge
                variant="secondary"
                className="cursor-pointer whitespace-nowrap"
                onClick={() => {
                  // Clear all tags by calling onTagSelect for each selected tag
                  selectedTags.forEach((tag) => onTagSelect(tag));
                }}
              >
                Clear filters
              </Badge>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default COETagSearch;
