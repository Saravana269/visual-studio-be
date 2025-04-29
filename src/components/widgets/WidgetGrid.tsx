
import { Widget } from "@/types/widget";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WidgetGridProps {
  widgets: Widget[];
  isLoading: boolean;
  tagDetails: Record<string, string>;
  onEditClick: (widget: Widget) => void;
  onViewDetails: (widget: Widget) => void;
  onCreateClick: () => void; // Added this prop
}

export function WidgetGrid({ 
  widgets, 
  isLoading, 
  tagDetails, 
  onEditClick, 
  onViewDetails,
  onCreateClick // Added this prop 
}: WidgetGridProps) {
  // Get tag labels from tag IDs
  const getTagLabels = (tagIds: string[] | null): string[] => {
    if (!tagIds) return [];
    return tagIds.map(id => tagDetails[id] || "Unknown Tag").filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-64 w-full rounded-md" />
        ))}
      </div>
    );
  }
  
  if (widgets.length === 0) {
    return (
      <div className="bg-muted p-8 rounded-md text-center">
        <h2 className="text-xl font-medium text-muted-foreground mb-2">
          No widgets found
        </h2>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first widget
        </p>
        <Button 
          onClick={onCreateClick} // Use the new prop here
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        >
          <Plus size={16} className="mr-2" /> Create Widget
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {widgets.map(widget => (
        <Card 
          key={widget.id} 
          className="cursor-pointer hover:border-[#9b87f5] transition-all"
          onClick={() => onViewDetails(widget)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{widget.name}</CardTitle>
            {widget.description && (
              <CardDescription className="line-clamp-2">{widget.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {widget.image_url ? (
              <div className="w-full h-32 bg-muted rounded-md mb-3 overflow-hidden">
                <img 
                  src={widget.image_url} 
                  alt={widget.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : (
              <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No preview available</p>
              </div>
            )}
            
            {/* Tags display */}
            {widget.tags && widget.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {getTagLabels(widget.tags).map((tagLabel, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#E5DEFF] text-[#6E59A5] text-xs px-2 py-1 rounded-sm flex items-center"
                  >
                    <Tag size={10} className="mr-1" /> {tagLabel}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(widget);
              }}
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(widget);
              }}
            >
              Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
