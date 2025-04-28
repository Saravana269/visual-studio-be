
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Pencil } from "lucide-react";
import { type Element } from "@/pages/ElementsManager";

interface ElementListProps {
  elements: Element[];
  onEdit: (element: Element) => void;
  onViewDetails: (element: Element) => void;
}

export function ElementList({
  elements,
  onEdit,
  onViewDetails
}: ElementListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {elements.map(element => (
        <Card key={element.id} className="overflow-hidden flex flex-col">
          <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
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
          
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-lg">{element.name}</h3>
            {element.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {element.description}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="pb-2 flex-1">
            {element.tags && element.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {element.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-2 flex justify-between">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(element)} className="gap-1">
              <FileText size={16} />
              View Details
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(element)} className="gap-1">
              <Pencil size={16} />
              Edit
            </Button>
          </CardFooter>
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
