
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { CoreSet } from "@/hooks/useCoreSetData";

interface CoreSetListProps {
  coreSets: CoreSet[];
  onEdit: (coreSet: CoreSet) => void;
  onView: (coreSet: CoreSet) => void;
  onMapping: (coreSet: CoreSet) => void;
}

const CoreSetList = ({ coreSets, onEdit, onView, onMapping }: CoreSetListProps) => {
  const navigate = useNavigate();
  
  const safeRenderString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    return String(value);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {coreSets.map(coreSet => (
        <Card 
          key={safeRenderString(coreSet.id)} 
          className="element-card relative flex flex-col overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(`/core-set/${coreSet.id}`)}
        >
          <div className="absolute top-2 right-2 z-10" onClick={e => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="action-menu-button">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => onEdit(coreSet)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/core-set/${coreSet.id}`)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/core-set/${coreSet.id}/assignment`)}>
                  Manage Assignments
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
            {coreSet.image_url ? (
              <img 
                src={safeRenderString(coreSet.image_url)} 
                alt={safeRenderString(coreSet.name)}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-muted-foreground text-sm">No image</div>
            )}
          </div>
          
          <CardHeader className="pb-2 p-3">
            <h3 className="font-semibold text-base">{safeRenderString(coreSet.name)}</h3>
            {coreSet.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {safeRenderString(coreSet.description)}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="pb-2 p-3 flex-1">
            {coreSet.destination_element_ids && coreSet.destination_element_ids.length > 0 && (
              <div className="text-sm text-muted-foreground mb-2">
                {coreSet.destination_element_ids.length} connected elements
              </div>
            )}
            {coreSet.tags && coreSet.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {coreSet.tags.map((tag, idx) => (
                  <Badge key={`tag-${idx}-${safeRenderString(tag).substring(0, 3)}`} variant="secondary" className="tag-badge">
                    {safeRenderString(tag)}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {coreSets.length === 0 && (
        <div className="col-span-full flex justify-center items-center py-12 text-muted-foreground">
          No Core Sets found
        </div>
      )}
    </div>
  );
};

export default CoreSetList;
