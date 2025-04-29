
import { Button } from "@/components/ui/button";
import { WidgetDetail } from "@/types/widget";
import { Tag } from "lucide-react";

interface WidgetTagsTabProps {
  tagIds: string[] | null;
  tagDetails: Record<string, string>;
  widget: WidgetDetail;
  onEdit: (widget: WidgetDetail) => void;
  onClose: () => void;
}

export function WidgetTagsTab({ 
  tagIds, 
  tagDetails, 
  widget, 
  onEdit, 
  onClose 
}: WidgetTagsTabProps) {
  // Get tags to display on widgets
  const getTagLabels = (tagIds: string[] | null): string[] => {
    if (!tagIds) return [];
    return tagIds.map(id => tagDetails[id] || "Unknown Tag").filter(Boolean);
  };

  const tagLabels = getTagLabels(tagIds);

  return (
    <div className="space-y-4">
      {tagIds && tagIds.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tagLabels.map((tag, idx) => (
            <div 
              key={idx} 
              className="bg-[#E5DEFF] text-[#6E59A5] px-3 py-2 rounded-md flex items-center"
            >
              <Tag size={14} className="mr-2" /> {tag}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No tags have been added to this widget yet.</p>
      )}
      <Button 
        variant="outline"
        onClick={() => {
          onClose();
          onEdit(widget);
        }}
        className="mt-2"
      >
        Manage Tags
      </Button>
    </div>
  );
}
