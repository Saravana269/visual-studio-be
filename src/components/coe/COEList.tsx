
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
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {coes.map((coe) => (
        <Card 
          key={coe.id} 
          className="element-card relative flex flex-col overflow-hidden cursor-pointer cyberpunk-card"
          onClick={() => onView(coe)}
        >
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="element-count-badge">
              {coe.element_count || 0} Elements
            </Badge>
          </div>
          
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="action-menu-button">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
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

          <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
            {coe.image_url ? (
              <img 
                src={coe.image_url} 
                alt={coe.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-muted-foreground text-sm">No image</div>
            )}
          </div>
          
          <CardHeader className="pb-2 p-3">
            <h3 className="font-semibold text-base">{coe.name}</h3>
            {coe.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {coe.description}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="pb-2 p-3 flex-1">
            {coe.tags && coe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {coe.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="tag-badge">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
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
