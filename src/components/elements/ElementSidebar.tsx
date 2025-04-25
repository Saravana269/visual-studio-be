
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Element } from "@/pages/ElementsManager";
import { Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ElementSidebarProps {
  element: Element;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function ElementSidebar({ element, open, onClose, onEdit }: ElementSidebarProps) {
  // Fetch COE data to display names instead of IDs
  const { data: coes, isLoading: isLoadingCoes } = useQuery({
    queryKey: ["coes", element.coe_ids],
    queryFn: async () => {
      if (!element.coe_ids || element.coe_ids.length === 0) {
        return [];
      }
      
      const { data, error } = await supabase
        .from("class_of_elements")
        .select("id, name, description")
        .in("id", element.coe_ids);
      
      if (error || !data) return [];
      
      return data;
    },
    enabled: !!element.coe_ids && element.coe_ids.length > 0,
  });

  // Count how many other elements are in the same COEs
  const { data: usageCount } = useQuery({
    queryKey: ["element-usage", element.id],
    queryFn: async () => {
      if (!element.coe_ids || element.coe_ids.length === 0) {
        return { total: 0, byCoe: {} };
      }
      
      const { data, error } = await supabase
        .from("elements")
        .select("id, coe_ids")
        .neq("id", element.id);
      
      if (error || !data) return { total: 0, byCoe: {} };
      
      const counts: Record<string, number> = {};
      let totalCount = 0;
      
      // Count elements by COE
      element.coe_ids.forEach(coeId => {
        const elementsInThisCoe = data.filter(e => 
          e.coe_ids && e.coe_ids.includes(coeId)
        );
        
        counts[coeId] = elementsInThisCoe.length;
        totalCount += elementsInThisCoe.length;
      });
      
      return { 
        total: totalCount,
        byCoe: counts
      };
    },
    enabled: !!element.coe_ids && element.coe_ids.length > 0,
  });

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center justify-between">
            {element.name}
            <Button variant="outline" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        {element.image_url && (
          <div className="mb-6">
            <img 
              src={element.image_url} 
              alt={element.name} 
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
        
        {element.description && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{element.description}</p>
          </div>
        )}
        
        {element.tags && element.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {element.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {element.coe_ids && element.coe_ids.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Associated COEs ({element.coe_ids.length})</h3>
            {isLoadingCoes ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-2">
                {coes?.map(coe => (
                  <div key={coe.id} className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{coe.name}</h4>
                      {usageCount?.byCoe[coe.id] > 0 && (
                        <Badge variant="outline">
                          {usageCount.byCoe[coe.id]} other element{usageCount.byCoe[coe.id] !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    {coe.description && (
                      <p className="text-sm text-muted-foreground mt-1">{coe.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {element.properties && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">JSON Properties</h3>
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs">
              {JSON.stringify(element.properties, null, 2)}
            </pre>
          </div>
        )}
        
        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
