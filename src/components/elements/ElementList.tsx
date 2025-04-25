
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Pencil } from "lucide-react";
import { type Element } from "@/pages/ElementsManager";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ElementListProps {
  elements: Element[];
  onEdit: (element: Element) => void;
  onViewDetails: (element: Element) => void;
}

export function ElementList({ elements, onEdit, onViewDetails }: ElementListProps) {
  // Fetch COE data to display names instead of IDs
  const { data: coes } = useQuery({
    queryKey: ["coes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_of_elements")
        .select("id, name");
      
      if (error || !data) return [];
      
      return data.reduce((acc, coe) => {
        acc[coe.id] = coe.name;
        return acc;
      }, {} as Record<string, string>);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {elements.map((element) => (
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
              <div className="flex flex-wrap gap-2 mb-4">
                {element.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
            
            {element.coe_ids && element.coe_ids.length > 0 && coes && (
              <div className="mt-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">Associated COEs:</p>
                <div className="flex flex-wrap gap-1">
                  {element.coe_ids.slice(0, 3).map(coeId => (
                    <Badge key={coeId} variant="outline">
                      {coes[coeId] || 'Unknown COE'}
                    </Badge>
                  ))}
                  {element.coe_ids.length > 3 && (
                    <Badge variant="outline">+{element.coe_ids.length - 3} more</Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-2 flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(element)}
              className="gap-1"
            >
              <FileText size={16} />
              View Details
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(element)}
              className="gap-1"
            >
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
