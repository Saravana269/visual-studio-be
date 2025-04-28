
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DropZone } from "../core-set/DropZone";
import { DraggableCard } from "../core-set/DraggableCard";

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
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedElement, setDraggedElement] = useState<Element | null>(null);
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set());
  
  // Fetch all elements
  const { data: elements = [], isLoading, refetch } = useQuery({
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
  
  // Store elements locally for immediate UI updates
  const [localAssignedElements, setLocalAssignedElements] = useState<Element[]>([]);
  const [localUnassignedElements, setLocalUnassignedElements] = useState<Element[]>([]);
  
  // Sync local state when data changes
  useEffect(() => {
    if (elements && elements.length > 0) {
      const assigned = elements.filter(
        (element) => element.coe_ids && element.coe_ids.includes(coeId)
      );
      
      const unassigned = elements.filter(
        (element) => !element.coe_ids || !element.coe_ids.includes(coeId)
      );
      
      setLocalAssignedElements(assigned);
      setLocalUnassignedElements(unassigned);
    }
  }, [elements, coeId]);
  
  // Filter elements based on search query
  const filteredUnassigned = searchQuery
    ? localUnassignedElements.filter(element => 
        element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (element.description && element.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (element.tags && element.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : localUnassignedElements;
  
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
      // Update each element's coe_ids and update local state immediately
      const updatedElements: Element[] = [];
      
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
        
        // Store updated element for local state update
        updatedElements.push({
          ...element,
          coe_ids: updatedCoeIds
        });
      }
      
      // Immediately update local state for UI refresh
      setLocalAssignedElements(prev => {
        // Remove elements that were unassigned
        const remaining = prev.filter(element => 
          !updatedElements.some(updated => 
            updated.id === element.id && targetType === "unassign"
          )
        );
        
        // Add newly assigned elements
        const newlyAssigned = updatedElements.filter(element => 
          targetType === "assign" && element.coe_ids?.includes(coeId)
        );
        
        return [...remaining, ...newlyAssigned];
      });
      
      setLocalUnassignedElements(prev => {
        // Remove elements that were assigned
        const remaining = prev.filter(element => 
          !updatedElements.some(updated => 
            updated.id === element.id && targetType === "assign"
          )
        );
        
        // Add newly unassigned elements
        const newlyUnassigned = updatedElements.filter(element => 
          targetType === "unassign" && (!element.coe_ids || !element.coe_ids.includes(coeId))
        );
        
        return [...remaining, ...newlyUnassigned];
      });
      
      // Clear selection and dragged element
      setSelectedElements(new Set());
      setDraggedElement(null);
      
      // Invalidate queries to ensure data consistency across components
      queryClient.invalidateQueries({ queryKey: ["elements"] });
      queryClient.invalidateQueries({ queryKey: ["coe-elements", coeId] });
      
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

  const handleDragEnd = () => {
    setDraggedElement(null);
  };
  
  // Handle assigning selected elements via button
  const handleAssignSelected = async () => {
    try {
      const elementsToAssign = elements.filter(element => selectedElements.has(element.id));
      const updatedElements: Element[] = [];
      
      // Update each element's coe_ids
      for (const element of elementsToAssign) {
        const updatedCoeIds = [...(element.coe_ids || []), coeId];
        await supabase
          .from("elements")
          .update({ coe_ids: updatedCoeIds })
          .eq("id", element.id);
        
        // Store updated element
        updatedElements.push({
          ...element,
          coe_ids: updatedCoeIds
        });
      }
      
      // Immediately update local state for UI refresh
      setLocalAssignedElements(prev => {
        const newAssigned = [...prev];
        updatedElements.forEach(element => {
          if (!newAssigned.some(e => e.id === element.id)) {
            newAssigned.push(element);
          }
        });
        return newAssigned;
      });
      
      setLocalUnassignedElements(prev => 
        prev.filter(element => !selectedElements.has(element.id))
      );
      
      // Clear selection
      setSelectedElements(new Set());
      
      // Invalidate queries to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["elements"] });
      queryClient.invalidateQueries({ queryKey: ["coe-elements", coeId] });
      
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
        <DropZone
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "unassign")}
          zone="unassign"
          className="bg-background border-dashed"
        >
          <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
            Available Elements ({filteredUnassigned.length})
          </div>
          
          {filteredUnassigned.length > 0 ? (
            <div className="space-y-2">
              {filteredUnassigned.map((element) => (
                <DraggableCard
                  key={element.id}
                  coe={element}
                  isSelected={selectedElements.has(element.id)}
                  onClick={() => toggleElementSelection(element.id)}
                  onDragStart={() => handleDragStart(element)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No elements found
            </div>
          )}
        </DropZone>
        
        {/* Assigned Elements Drop Zone */}
        <DropZone
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "assign")}
          zone="assign"
          className="bg-background border-primary/20 hover:border-primary/40 transition-colors"
        >
          <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
            Assigned to COE ({localAssignedElements.length})
            {selectedElements.size > 0 && (
              <Badge className="ml-2 bg-primary">Drag {selectedElements.size} elements here</Badge>
            )}
          </div>
          
          {localAssignedElements.length > 0 ? (
            <div className="space-y-2">
              {localAssignedElements.map((element) => (
                <DraggableCard
                  key={element.id}
                  coe={element}
                  isSelected={selectedElements.has(element.id)}
                  onClick={() => toggleElementSelection(element.id)}
                  onDragStart={() => handleDragStart(element)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-4 text-muted-foreground text-sm">
              <p>Drag elements here to assign</p>
              <p className="text-xs mt-1">Or select multiple and drag them as a group</p>
            </div>
          )}
        </DropZone>
      </div>
      
      {selectedElements.size > 0 && (
        <div className="flex justify-end">
          <Button 
            size="sm"
            onClick={handleAssignSelected}
          >
            Assign {selectedElements.size} Selected
          </Button>
        </div>
      )}
    </div>
  );
};
