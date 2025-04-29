
import { Widget } from "@/types/widget";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

interface WidgetListProps {
  widgets: Widget[];
  tagDetails: Record<string, string>;
  onEditClick: (widget: Widget) => void;
  onViewDetails: (widget: Widget) => void;
}

export function WidgetList({ widgets, tagDetails, onEditClick, onViewDetails }: WidgetListProps) {
  // Get tag labels from tag IDs
  const getTagLabels = (tagIds: string[] | null): string[] => {
    if (!tagIds) return [];
    return tagIds.map(id => tagDetails[id] || "Unknown Tag").filter(Boolean);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {widgets.map(widget => (
            <TableRow key={widget.id}>
              <TableCell className="font-medium">{widget.name}</TableCell>
              <TableCell className="max-w-xs truncate">
                {widget.description || "-"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {getTagLabels(widget.tags).map((tag, idx) => (
                    <div 
                      key={idx} 
                      className="bg-[#E5DEFF] text-[#6E59A5] text-xs px-2 py-1 rounded-sm flex items-center"
                    >
                      <Tag size={10} className="mr-1" /> {tag}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(widget.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditClick(widget)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewDetails(widget)}
                  >
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
