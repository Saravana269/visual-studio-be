
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Element {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  coe_ids: string[] | null;
  tags: string[] | null;
}

interface ElementsAssignmentProps {
  coeId: string;
  onAssignmentChange: () => void;
}

export const ElementsAssignment = ({ coeId, onAssignmentChange }: ElementsAssignmentProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedElement, setDraggedElement] = useState<Element | null>(null);
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set());
  
  // Fetch all elements
  const { data: elements = [], isLoading } = useQuery({
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
  });
  
  // Filter elements into assigned and unassigned based on coe_ids
  const assignedElements = elements.filter(
    (element) => element.coe_ids && element.coe_ids.includes(coeId)
  );
  
  const unassignedElements = elements.filter(
    (element) => !element.coe_ids || !element.coe_ids.includes(coeId)
  );
  
  // Filter elements based on search query
  const filteredUnassigned = searchQuery
    ? unassignedElements.filter(element => 
        element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (element.description && element.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (element.tags && element.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : unassignedElements;
  
  // Handle drag events
  const handleDragStart = (element: Element) => {
    setDraggedElement(element);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Handle dropping elements to assign them to the COE
  const handleDrop = async (e: React.DragEvent, targetType: "assign" | "unassign") => {
    e.preventDefault();
    
    const elementsToUpdate: Element[] = [];
    
    // If element is being dragged, add it to the array
    if (draggedElement) {
      elementsToUpdate.push(draggedElement);
    }
    
    // Add all selected elements
    if (selectedElements.size > 0) {
      elements
        .filter(element => selectedElements.has(element.id))
        .forEach(element => {
          if (!elementsToUpdate.some(e => e.id === element.id)) {
            elementsToUpdate.push(element);
          }
        });
    }
    
    if (elementsToUpdate.length === 0) return;
    
    try {
      // Update each element's coe_ids
      for (const element of elementsToUpdate) {
        let updatedCoeIds: string[] = element.coe_ids || [];
        
        if (targetType === "assign" && !updatedCoeIds.includes(coeId)) {
          updatedCoeIds = [...updatedCoeIds, coeId];
        } else if (targetType === "unassign") {
          updatedCoeIds = updatedCoeIds.filter(id => id !== coeId);
        }
        
        await supabase
          .from("elements")
          .update({ coe_ids: updatedCoeIds })
          .eq("id", element.id);
      }
      
      // Clear selection and dragged element
      setSelectedElements(new Set());
      setDraggedElement(null);
      
      // Notify parent of change
      onAssignmentChange();
      
      // Show success toast
      toast({
        title: `${elementsToUpdate.length} element${elementsToUpdate.length !== 1 ? 's' : ''} ${targetType === "assign" ? "assigned" : "unassigned"}`,
        description: `Successfully ${targetType === "assign" ? "added to" : "removed from"} this COE`
      });
    } catch (error) {
      console.error(`Error ${targetType}ing elements:`, error);
      toast({
        title: "Error",
        description: `Failed to ${targetType} elements. Please try again.`,
        variant: "destructive"
      });
    }
  };
  
  // Handle clicking on an element to select/deselect it
  const toggleElementSelection = (elementId: string) => {
    const newSelected = new Set(selectedElements);
    if (newSelected.has(elementId)) {
      newSelected.delete(elementId);
    } else {
      newSelected.add(elementId);
    }
    setSelectedElements(newSelected);
  };
  
  // Handle selecting all visible elements
  const selectAllVisible = () => {
    const newSelected = new Set(selectedElements);
    filteredUnassigned.forEach(element => newSelected.add(element.id));
    setSelectedElements(newSelected);
  };
  
  // Handle deselecting all elements
  const clearSelection = () => {
    setSelectedElements(new Set());
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading elements...</div>;
  }
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Element Assignment</h3>
      
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search elements..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {selectedElements.size > 0 ? (
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              Clear ({selectedElements.size})
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={selectAllVisible}>
              Select All
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Unassigned Elements */}
        <div
          className="border rounded-md p-2 bg-card min-h-[200px] max-h-[400px] overflow-y-auto"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "unassign")}
        >
          <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
            Available Elements ({filteredUnassigned.length})
          </div>
          
          {filteredUnassigned.length > 0 ? (
            <div className="space-y-2">
              {filteredUnassigned.map((element) => (
                <Card
                  key={element.id}
                  className={`cursor-pointer transition-all p-2 ${
                    selectedElements.has(element.id) ? "border-primary bg-primary/5" : ""
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(element)}
                  onClick={() => toggleElementSelection(element.id)}
                >
                  <div className="flex items-center gap-2">
                    {element.image_url && (
                      <div className="w-8 h-8 bg-muted flex-shrink-0">
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
                          {element.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs py-0 px-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No elements found
            </div>
          )}
        </div>
        
        {/* Assigned Elements Drop Zone */}
        <div
          className="border rounded-md p-2 bg-card min-h-[200px] max-h-[400px] overflow-y-auto border-dashed border-primary/50"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "assign")}
        >
          <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
            Assigned to COE ({assignedElements.length})
            {selectedElements.size > 0 && (
              <Badge className="ml-2 bg-primary">Drag {selectedElements.size} elements here</Badge>
            )}
          </div>
          
          {assignedElements.length > 0 ? (
            <div className="space-y-2">
              {assignedElements.map((element) => (
                <Card
                  key={element.id}
                  className="p-2"
                  draggable
                  onDragStart={() => handleDragStart(element)}
                >
                  <div className="flex items-center gap-2">
                    {element.image_url && (
                      <div className="w-8 h-8 bg-muted flex-shrink-0">
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
                          {element.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs py-0 px-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-4 text-muted-foreground text-sm">
              <p>Drag elements here to assign</p>
              <p className="text-xs mt-1">Or select multiple and drag them as a group</p>
            </div>
          )}
        </div>
      </div>
      
      {selectedElements.size > 0 && (
        <div className="flex justify-end">
          <Button 
            size="sm"
            onClick={async () => {
              try {
                // Update all selected elements
                for (const elementId of selectedElements) {
                  const element = elements.find(e => e.id === elementId);
                  if (element) {
                    const updatedCoeIds = [...(element.coe_ids || []), coeId];
                    await supabase
                      .from("elements")
                      .update({ coe_ids: updatedCoeIds })
                      .eq("id", elementId);
                  }
                }
                
                // Clear selection
                setSelectedElements(new Set());
                
                // Notify parent of change
                onAssignmentChange();
                
                // Show success toast
                toast({
                  title: `${selectedElements.size} elements assigned`,
                  description: "Successfully added to this COE"
                });
              } catch (error) {
                console.error("Error assigning elements:", error);
                toast({
                  title: "Error",
                  description: "Failed to assign elements. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          >
            Assign {selectedElements.size} Selected
          </Button>
        </div>
      )}
    </div>
  );
};
