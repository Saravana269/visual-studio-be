
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus } from "lucide-react";
import type { CoreSet } from "@/hooks/useCoreSetData";

interface CoreSetDetailsDialogProps {
  coreSet: CoreSet | null;
  open: boolean;
  onClose: () => void;
}

// Define an Element interface to use in this component
interface Element {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  coe_ids: string[] | null;
  tags: string[] | null;
}

const CoreSetDetailsDialog = ({ coreSet, open, onClose }: CoreSetDetailsDialogProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedElement, setDraggedElement] = useState<Element | null>(null);
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set());
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setDraggedElement(null);
      setSelectedElements(new Set());
    }
  }, [open]);

  // Helper function to safely stringify any value
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return 'Not specified';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return 'Complex value';
  };

  // Fetch all elements
  const { data: elements = [], isLoading: elementsLoading } = useQuery({
    queryKey: ["elements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("elements")
        .select("*");
      
      if (error) {
        console.error("Error fetching elements:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: open,
  });

  // Fetch COEs
  const { data: coes = [], isLoading: coesLoading } = useQuery({
    queryKey: ["coes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_of_elements")
        .select("*");
      
      if (error) {
        console.error("Error fetching COEs:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: open,
  });

  if (!coreSet) return null;

  // Get primary element details
  const primaryElement = coreSet.source_element_id 
    ? elements.find(element => element.id === coreSet.source_element_id) 
    : null;

  // Get secondary elements details
  const secondaryElements = coreSet.destination_element_ids
    ? elements.filter(element => coreSet.destination_element_ids?.includes(element.id))
    : [];

  // Get available elements for assignment (excluding already assigned elements)
  const availableElements = elements.filter(element => 
    element.id !== coreSet.source_element_id && 
    !coreSet.destination_element_ids?.includes(element.id)
  );

  // Filter available elements based on search query
  const filteredElements = searchQuery
    ? availableElements.filter(element =>
        element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (element.description && element.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (element.tags && element.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : availableElements;

  // Handle drag events
  const handleDragStart = (element: Element) => {
    setDraggedElement(element);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle dropping elements for primary (source) element
  const handleDropOnPrimary = async (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedElement) return;
    
    // Don't allow if element is already a secondary element
    if (coreSet.destination_element_ids?.includes(draggedElement.id)) {
      toast({
        title: "Element already assigned",
        description: "This element is already assigned as a secondary element",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Update the core set with the new source element ID
      const { error } = await supabase
        .from("core_sets")
        .update({ source_element_id: draggedElement.id })
        .eq("id", coreSet.id);
      
      if (error) {
        console.error("Error updating core set:", error);
        toast({
          title: "Error",
          description: "Failed to assign primary element",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Primary element assigned",
        description: `${draggedElement.name} is now the primary element`,
      });
      
      // Reset drag state
      setDraggedElement(null);
    } catch (error) {
      console.error("Error in drop handler:", error);
    }
  };

  // Handle dropping elements for secondary (destination) elements
  const handleDropOnSecondary = async (e: React.DragEvent) => {
    e.preventDefault();
    
    const elementsToAdd: Element[] = [];
    
    // Add dragged element if present
    if (draggedElement) {
      elementsToAdd.push(draggedElement);
    }
    
    // Add selected elements
    if (selectedElements.size > 0) {
      elements
        .filter(element => selectedElements.has(element.id))
        .forEach(element => {
          if (!elementsToAdd.some(e => e.id === element.id)) {
            elementsToAdd.push(element);
          }
        });
    }
    
    if (elementsToAdd.length === 0) return;
    
    try {
      // Get current destination element IDs or initialize empty array
      const currentIds = coreSet.destination_element_ids || [];
      
      // Add new element IDs, avoiding duplicates
      const newElementIds = [
        ...currentIds,
        ...elementsToAdd
          .map(element => element.id)
          .filter(id => !currentIds.includes(id) && id !== coreSet.source_element_id)
      ];
      
      // Update the core set with the new destination element IDs
      const { error } = await supabase
        .from("core_sets")
        .update({ destination_element_ids: newElementIds })
        .eq("id", coreSet.id);
      
      if (error) {
        console.error("Error updating core set:", error);
        toast({
          title: "Error",
          description: "Failed to assign secondary elements",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Secondary elements assigned",
        description: `${elementsToAdd.length} element(s) added as secondary elements`,
      });
      
      // Reset selection and drag states
      setSelectedElements(new Set());
      setDraggedElement(null);
    } catch (error) {
      console.error("Error in drop handler:", error);
    }
  };

  // Handle element selection (for multi-selection)
  const toggleElementSelection = (elementId: string) => {
    const newSelected = new Set(selectedElements);
    if (newSelected.has(elementId)) {
      newSelected.delete(elementId);
    } else {
      newSelected.add(elementId);
    }
    setSelectedElements(newSelected);
  };

  // Handle removing an element from secondary elements
  const handleRemoveSecondaryElement = async (elementId: string) => {
    if (!coreSet.destination_element_ids) return;
    
    try {
      const updatedIds = coreSet.destination_element_ids.filter(id => id !== elementId);
      
      const { error } = await supabase
        .from("core_sets")
        .update({ destination_element_ids: updatedIds })
        .eq("id", coreSet.id);
      
      if (error) {
        console.error("Error updating core set:", error);
        toast({
          title: "Error",
          description: "Failed to remove element",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Element removed",
        description: "Element removed from secondary elements",
      });
    } catch (error) {
      console.error("Error removing element:", error);
    }
  };

  // Handle clearing primary element
  const handleClearPrimaryElement = async () => {
    try {
      const { error } = await supabase
        .from("core_sets")
        .update({ source_element_id: null })
        .eq("id", coreSet.id);
      
      if (error) {
        console.error("Error updating core set:", error);
        toast({
          title: "Error",
          description: "Failed to clear primary element",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Primary element cleared",
      });
    } catch (error) {
      console.error("Error clearing primary element:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="sm:max-w-md w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{coreSet.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">
              {coreSet.description || "No description available"}
            </p>
          </div>

          {/* Search functionality */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search elements..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {selectedElements.size > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {selectedElements.size} element(s) selected
              </div>
            )}
          </div>
          
          {/* Element assignment section */}
          <div className="space-y-4">
            {/* Primary Element Drop Zone */}
            <div>
              <h3 className="text-sm font-medium mb-1">Primary Element</h3>
              <div 
                className="bg-muted rounded-md p-3 min-h-16 border-2 border-dashed border-primary/30"
                onDragOver={handleDragOver}
                onDrop={handleDropOnPrimary}
              >
                {primaryElement ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {primaryElement.image_url && (
                        <div className="w-10 h-10 bg-background rounded overflow-hidden">
                          <img 
                            src={primaryElement.image_url} 
                            alt={primaryElement.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{primaryElement.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {primaryElement.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleClearPrimaryElement}
                    >
                      Clear
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-4 text-sm text-muted-foreground">
                    <p>Drag an element here to set as primary</p>
                  </div>
                )}
              </div>
            </div>

            {/* Secondary Elements Drop Zone */}
            <div>
              <h3 className="text-sm font-medium mb-1">Secondary Elements</h3>
              <div 
                className="bg-muted rounded-md p-3 min-h-16 border-2 border-dashed border-primary/30"
                onDragOver={handleDragOver}
                onDrop={handleDropOnSecondary}
              >
                {secondaryElements.length > 0 ? (
                  <div className="space-y-2">
                    {secondaryElements.map(element => (
                      <div 
                        key={element.id} 
                        className="flex items-center justify-between bg-background rounded p-2"
                      >
                        <div className="flex items-center gap-2">
                          {element.image_url && (
                            <div className="w-8 h-8 bg-muted rounded overflow-hidden">
                              <img 
                                src={element.image_url} 
                                alt={element.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <p className="text-sm">{element.name}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveSecondaryElement(element.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-4 text-sm text-muted-foreground">
                    <p>Drag elements here to set as secondary</p>
                    <p className="text-xs mt-1">You can select multiple elements</p>
                  </div>
                )}
              </div>
            </div>

            {/* Available Elements */}
            <div>
              <h3 className="text-sm font-medium mb-1">
                Available Elements ({filteredElements.length})
              </h3>
              <div className="bg-background border rounded-md p-2 max-h-64 overflow-y-auto">
                {elementsLoading ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    Loading elements...
                  </div>
                ) : filteredElements.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredElements.map(element => (
                      <div
                        key={element.id}
                        className={`p-2 border rounded-md cursor-pointer ${
                          selectedElements.has(element.id) ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(element)}
                        onClick={() => toggleElementSelection(element.id)}
                      >
                        <div className="flex items-center gap-2">
                          {element.image_url && (
                            <div className="w-8 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={element.image_url} 
                                alt={element.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{element.name}</p>
                            {element.tags && element.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {element.tags.slice(0, 2).map((tag, idx) => (
                                  <Badge key={`tag-${idx}-${element.id}`} variant="outline" className="text-xs py-0 px-1">
                                    {safeRender(tag)}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No elements found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {coreSet.tags && coreSet.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {coreSet.tags.map((tag, idx) => (
                  <Badge key={`tag-${idx}`} variant="secondary">
                    {safeRender(tag)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CoreSetDetailsDialog;
