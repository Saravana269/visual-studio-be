
import { Widget } from "@/types/widget";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tag, MoreVertical, Layout } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface WidgetGridProps {
  widgets: Widget[];
  isLoading: boolean;
  tagDetails: Record<string, string>;
  onEditClick: (widget: Widget) => void;
  onViewDetails: (widget: Widget) => void;
  onCreateClick: () => void;
}

export function WidgetGrid({ 
  widgets, 
  isLoading, 
  tagDetails, 
  onEditClick, 
  onViewDetails,
  onCreateClick
}: WidgetGridProps) {
  const navigate = useNavigate();
  
  // Get tag labels from tag IDs
  const getTagLabels = (tagIds: string[] | null): string[] => {
    if (!tagIds) return [];
    return tagIds.map(id => tagDetails[id] || "Unknown Tag").filter(Boolean);
  };

  // Navigate to screens page
  const handleManageScreens = (widget: Widget, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/widgets/${widget.id}/screens`);
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
          onClick={onCreateClick}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        >
          <Plus size={16} className="mr-2" /> Create Widget
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {widgets.map(widget => (
        <Card 
          key={widget.id} 
          className="element-card relative flex flex-col overflow-hidden cursor-pointer" 
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('.element-card-menu')) {
              e.stopPropagation();
              return;
            }
            onViewDetails(widget);
          }}
        >
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="element-card-menu">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEditClick(widget);
                }}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(widget);
                }}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleManageScreens(widget, e)}>
                  <Layout size={14} className="mr-2" /> Manage Screens
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
            {widget.image_url ? (
              <img 
                src={widget.image_url} 
                alt={widget.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-muted-foreground text-sm">No image</div>
            )}
          </div>
          
          <div className="pb-2 p-3">
            <h3 className="font-semibold text-base">{widget.name}</h3>
            {widget.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {widget.description}
              </p>
            )}
          </div>
          
          <div className="pb-2 p-3 flex-1">
            {widget.tags && widget.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {getTagLabels(widget.tags).map((tagLabel, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="tag-badge bg-[#FFA13010] text-[#FFA130] border-[#FFA130] rounded-sm"
                  >
                    <Tag size={10} className="mr-1" /> {tagLabel}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
