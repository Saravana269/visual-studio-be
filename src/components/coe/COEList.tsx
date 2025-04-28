
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface COE {
  id: string;
  name: string;
  description: string | null;
  image_url?: string | null;
  tags: string[] | null;
  element_count?: number;
}

interface COEListProps {
  coes: COE[];
  onEdit: (coe: COE) => void;
  onView: (coe: COE) => void;
}

const COEList = ({ coes, onEdit, onView }: COEListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {coes.map((coe) => (
        <Card 
          key={coe.id} 
          className="element-card relative flex flex-col overflow-hidden cursor-pointer cyberpunk-card"
          onClick={() => onView(coe)}
        >
          <div className="cyberpunk-image-container">
            <AspectRatio ratio={16/9} className="w-full">
              <img 
                src={coe.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475"} 
                alt={coe.name}
                className="w-full h-full object-cover cyberpunk-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475";
                }}
              />
              <div className="cyberpunk-image-overlay"></div>
            </AspectRatio>
          </div>
          
          <CardHeader className="pb-2 p-3">
            <h3 className="font-semibold text-base cyberpunk-text">{coe.name}</h3>
            {coe.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {coe.description}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="pb-2 p-3 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs cyberpunk-badge">
                {coe.element_count || 0} Elements
              </Badge>
            </div>
            
            {coe.tags && coe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {coe.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs cyberpunk-badge">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          
          <div className="element-card-menu absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cyberpunk-button">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] cyberpunk-menu">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit(coe);
                }}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onView(coe);
                }}>
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
      
      {coes.length === 0 && (
        <div className="col-span-full flex justify-center items-center py-12 text-muted-foreground">
          No COEs found
        </div>
      )}
    </div>
  );
};

export default COEList;
