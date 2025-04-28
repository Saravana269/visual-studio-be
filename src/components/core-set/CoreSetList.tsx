
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
}

const CoreSetList = ({ coreSets, onEdit, onView }: CoreSetListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {coreSets.map(coreSet => (
        <Card 
          key={coreSet.id} 
          className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
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
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{coreSet.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => onEdit(coreSet)}>
                    Edit Core Set
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onView(coreSet)}>
                    View Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {coreSet.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {coreSet.description}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="pt-0 mt-auto">
            {coreSet.destination_element_ids && coreSet.destination_element_ids.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {coreSet.destination_element_ids.length} connected elements
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
