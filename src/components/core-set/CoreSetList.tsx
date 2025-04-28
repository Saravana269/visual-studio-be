
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CoreSetDetailsDialog from "./CoreSetDetailsDialog";
import { useState } from "react";
import type { CoreSet } from "@/hooks/useCoreSetData";

interface CoreSetListProps {
  coreSets: CoreSet[];
  onEdit: (coreSet: CoreSet) => void;
  onView: (coreSet: CoreSet) => void;
}

const CoreSetList = ({ coreSets, onEdit, onView }: CoreSetListProps) => {
  const [selectedCoreSet, setSelectedCoreSet] = useState<CoreSet | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (coreSet: CoreSet) => {
    setSelectedCoreSet(coreSet);
    setIsDetailsOpen(true);
  };

  const handleMapping = (e: React.MouseEvent, coreSet: CoreSet) => {
    e.stopPropagation(); // Prevent triggering the card click
    // Handle mapping logic here - for now just log
    console.log("Mapping clicked for core set:", coreSet.name);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {coreSets.map(coreSet => (
          <Card 
            key={coreSet.id} 
            className="element-card relative flex flex-col overflow-hidden cursor-pointer"
            onClick={() => handleViewDetails(coreSet)}
          >
            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="action-menu-button" onClick={e => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit(coreSet);
                  }}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewDetails(coreSet)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleMapping(e, coreSet)}>
                    <Map className="h-4 w-4 mr-2" />
                    Mapping
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
              {coreSet.image_url ? (
                <img 
                  src={coreSet.image_url} 
                  alt={coreSet.name}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-muted-foreground text-sm">No image</div>
              )}
            </div>
            
            <CardHeader className="pb-2 p-3">
              <h3 className="font-semibold text-base">{coreSet.name}</h3>
              {coreSet.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {coreSet.description}
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
                  {coreSet.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="tag-badge">
                      {tag}
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

      <CoreSetDetailsDialog
        coreSet={selectedCoreSet}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  );
};

export default CoreSetList;
