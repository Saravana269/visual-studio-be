import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { type Element } from "@/pages/ElementsManager";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ElementListProps {
  elements: Element[];
  onEdit: (element: Element) => void;
  onViewDetails: (element: Element) => void;
  onManageTags: (element: Element, action: 'add' | 'remove') => void;
}

export function ElementList({
  elements,
  onEdit,
  onViewDetails,
  onManageTags
}: ElementListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {elements.map(element => (
        <Card 
          key={element.id} 
          className="element-card relative flex flex-col overflow-hidden cursor-pointer"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('.element-card-menu')) {
              e.stopPropagation();
              return;
            }
            onViewDetails(element);
          }}
        >
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="action-menu-button">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit(element);
                }}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(element);
                }}>View Details</DropdownMenuItem>
                
                {(!element.tags || element.tags.length === 0) ? (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onManageTags(element, 'add');
                  }}>
                    Add Tags
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onManageTags(element, 'remove');
                  }}>
                    Remove Tags
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
            {element.image_url ? (
              <img 
                src={element.image_url} 
                alt={element.name}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-muted-foreground text-sm">No image</div>
            )}
          </div>
          
          <CardHeader className="pb-2 p-3">
            <h3 className="font-semibold text-base">{element.name}</h3>
            {element.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {element.description}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="pb-2 p-3 flex-1">
            {element.tags && element.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {element.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="tag-badge">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {elements.length === 0 && (
        <div className="col-span-full flex justify-center items-center py-12 text-muted-foreground">
          No elements found
        </div>
      )}
    </div>
  );
}
